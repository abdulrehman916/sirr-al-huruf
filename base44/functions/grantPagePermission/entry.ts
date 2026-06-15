import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin/owner access
    const user = await base44.auth.me();
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return Response.json({ error: 'Unauthorized - Admin/Owner access required' }, { status: 403 });
    }

    const { user_id, page_path, page_name, permission_code, start_date, expiry_date } = await req.json();

    if (!user_id || !page_path || !permission_code || !start_date || !expiry_date) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }

    const now = new Date();
    const permissionId = `PERM-${now.getTime()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Check if permission already exists
    const existingPermissions = await base44.entities.PagePermission.filter({
      user_id: user_id,
      page_path: page_path,
      permission_code: permission_code,
      is_active: true,
      is_revoked: false
    });

    if (existingPermissions.length > 0) {
      return Response.json({ 
        error: 'Permission already exists for this user and page',
        existing_permission_id: existingPermissions[0].permission_id
      }, { status: 409 });
    }

    // Create permission
    const permission = await base44.entities.PagePermission.create({
      permission_id: permissionId,
      user_id: user_id,
      page_path: page_path,
      page_name: page_name || page_path,
      permission_code: permission_code,
      granted_by: user.id,
      granted_at: now.toISOString(),
      start_date: new Date(start_date).toISOString(),
      expiry_date: new Date(expiry_date).toISOString(),
      is_active: true,
      is_revoked: false,
      extended_count: 0
    });

    // Update user profile permission count
    const profiles = await base44.entities.UserAccessProfile.filter({ user_id: user_id });
    if (profiles.length > 0) {
      const profile = profiles[0];
      await base44.entities.UserAccessProfile.update(profile.id, {
        total_permissions: (profile.total_permissions || 0) + 1,
        active_permissions: (profile.active_permissions || 0) + 1
      });
    }

    return Response.json({
      success: true,
      permission_id: permissionId,
      message: 'Permission granted successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});