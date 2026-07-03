import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * syncEntityRegistry — Automatic Entity Registration
 *
 * Synchronizes the entity list (from entityManifest, sent by frontend) to
 * EntityRegistry database records. Ensures every entity automatically appears
 * in: Admin Entity Manager, Analytics, Audit Logs, and permission selectors.
 *
 * Safe operations ONLY:
 *   - Creates missing records with default values
 *   - Updates display_name/description/icon for auto-created records (never overwrites admin fields)
 *   - Archives records for removed entities (never deletes — preserves references)
 *   - Reactivates records when entities come back
 *   - NEVER touches admin-configured fields: supports_crud, admin_visible, etc. (when admin has customized)
 *   - NEVER deletes records (archive = is_active: false, archived: true)
 *
 * Security: Uses service role. No admin auth required — runs on app load for all users.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const entities = body?.entities;

    if (!Array.isArray(entities) || entities.length === 0) {
      return Response.json(
        { error: 'Invalid input: entities array required' },
        { status: 400 }
      );
    }

    if (entities.length > 200) {
      return Response.json(
        { error: 'Too many entities (max 200)' },
        { status: 400 }
      );
    }

    // Validate and sanitize
    const validEntities = entities
      .filter(
        (e) =>
          e &&
          typeof e.entity_name === 'string' &&
          e.entity_name.length > 0 &&
          /^[A-Za-z_][A-Za-z0-9_]*$/.test(e.entity_name) &&
          typeof e.display_name === 'string' &&
          e.display_name.length > 0 &&
          typeof e.category === 'string'
      )
      .map((e) => ({
        entity_name: e.entity_name.substring(0, 100),
        display_name: e.display_name.substring(0, 200),
        description: (e.description || '').substring(0, 500),
        category: e.category,
        icon: (e.icon || '').substring(0, 50),
        admin_visible: e.admin_visible !== false,
        supports_crud: e.supports_crud !== false,
        supports_search: e.supports_search !== false,
        supports_export: e.supports_export !== false,
        supports_import: e.supports_import !== false,
        is_system: e.is_system === true,
        sort_order: typeof e.sort_order === 'number' ? e.sort_order : 0,
      }));

    if (validEntities.length === 0) {
      return Response.json(
        { error: 'No valid entities provided' },
        { status: 400 }
      );
    }

    // Fetch all existing EntityRegistry records
    const existing =
      await base44.asServiceRole.entities.EntityRegistry.list(
        '-updated_at',
        200
      );
    const existingMap = {};
    (existing || []).forEach((e) => {
      if (e.entity_name) existingMap[e.entity_name] = e;
    });

    const now = new Date().toISOString();
    let created = 0,
      updated = 0,
      archived = 0,
      reactivated = 0,
      unchanged = 0;
    const entityNames = new Set(validEntities.map((e) => e.entity_name));

    // Phase 1: Upsert
    for (const ent of validEntities) {
      const ex = existingMap[ent.entity_name];

      if (ex) {
        const isAutoCreated = !ex.updated_by;
        const needsNameUpdate =
          isAutoCreated && ex.display_name !== ent.display_name;
        const needsDescUpdate =
          isAutoCreated && ex.description !== ent.description;
        const needsIconUpdate = isAutoCreated && ex.icon !== ent.icon;
        const needsReactivate =
          isAutoCreated && (ex.is_active === false || ex.archived === true);

        if (needsNameUpdate || needsDescUpdate || needsIconUpdate || needsReactivate) {
          const updateData = { updated_at: now };
          if (needsNameUpdate) updateData.display_name = ent.display_name;
          if (needsDescUpdate) updateData.description = ent.description;
          if (needsIconUpdate) updateData.icon = ent.icon;
          if (needsReactivate) {
            updateData.is_active = true;
            updateData.archived = false;
          }
          await base44.asServiceRole.entities.EntityRegistry.update(
            ex.id,
            updateData
          );
          if (needsReactivate) reactivated++;
          else updated++;
        } else {
          unchanged++;
        }
      } else {
        await base44.asServiceRole.entities.EntityRegistry.create({
          entity_name: ent.entity_name,
          display_name: ent.display_name,
          description: ent.description,
          category: ent.category,
          icon: ent.icon,
          admin_visible: ent.admin_visible,
          supports_crud: ent.supports_crud,
          supports_search: ent.supports_search,
          supports_export: ent.supports_export,
          supports_import: ent.supports_import,
          is_system: ent.is_system,
          is_active: true,
          archived: false,
          sort_order: ent.sort_order,
          updated_at: now,
        });
        created++;
      }
    }

    // Phase 2: Archive orphaned records (entities no longer in manifest)
    // Never archive system entities, never touch admin-customized records
    for (const ex of existing || []) {
      if (
        ex.entity_name &&
        !entityNames.has(ex.entity_name) &&
        !ex.is_system &&
        ex.is_active !== false &&
        !ex.updated_by
      ) {
        await base44.asServiceRole.entities.EntityRegistry.update(ex.id, {
          is_active: false,
          archived: true,
          updated_at: now,
        });
        archived++;
      }
    }

    return Response.json({
      success: true,
      created,
      updated,
      archived,
      reactivated,
      unchanged,
      total_entities: validEntities.length,
      total_records: (existing || []).length,
    });
  } catch (error) {
    console.error('syncEntityRegistry error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});