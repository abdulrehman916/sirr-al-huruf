/**
 * Entity Registry — Auto-derives from the central Entity Manifest.
 * Provides query APIs for the Admin Entity Manager, Analytics, and Audit systems.
 */
import { ENTITY_MANIFEST, ENTITY_CATEGORIES } from '@/lib/entityManifest';

/**
 * Get all entity definitions from the manifest.
 * @returns {Array} All entity definitions
 */
export function getAllEntities() {
  return ENTITY_MANIFEST;
}

/**
 * Get all entities visible in the admin Entity Manager.
 * @returns {Array}
 */
export function getVisibleEntities() {
  return ENTITY_MANIFEST.filter(e => e.admin_visible !== false);
}

/**
 * Get all CRUD-enabled entities (entities that can be created/edited/deleted via Entity Manager).
 * @returns {Array}
 */
export function getCrudEntities() {
  return ENTITY_MANIFEST.filter(e => e.supports_crud !== false);
}

/**
 * Get a single entity by name.
 * @param {string} name
 * @returns {object|null}
 */
export function getEntityByName(name) {
  return ENTITY_MANIFEST.find(e => e.name === name) || null;
}

/**
 * Get entities by category.
 * @param {string} category
 * @returns {Array}
 */
export function getEntitiesByCategory(category) {
  return ENTITY_MANIFEST.filter(e => e.category === category);
}

/**
 * Get all unique categories.
 * @returns {Array<string>}
 */
export function getAllCategories() {
  return Object.keys(ENTITY_CATEGORIES);
}

/**
 * Count total entities.
 * @returns {number}
 */
export function getEntityCount() {
  return ENTITY_MANIFEST.length;
}

/**
 * Build the canonical entity list for backend sync (syncEntityRegistry).
 * Strips computed fields, keeps only sync-relevant metadata.
 * @returns {Array}
 */
export function buildEntitySyncList() {
  return ENTITY_MANIFEST.map(e => ({
    entity_name: e.name,
    display_name: e.display_name,
    description: e.description || '',
    category: e.category,
    icon: e.icon || '',
    admin_visible: e.admin_visible !== false,
    supports_crud: e.supports_crud !== false,
    supports_search: e.supports_search !== false,
    supports_export: e.supports_export !== false,
    supports_import: e.supports_import !== false,
    is_system: e.is_system === true,
    sort_order: e.sort_order || 0,
  }));
}