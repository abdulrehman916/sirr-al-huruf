/**
 * Module Registry — Auto-derives all modules from the central manifest.
 *
 * Provides unified query APIs for features, methods, sections, tools, and calculators.
 * This is the runtime query layer — the data lives in moduleManifest.js.
 *
 * Usage:
 *   import { getAllModuleDefinitions, getModulesByPage } from '@/lib/moduleRegistry';
 */
import { MODULE_DEFINITIONS, MODULE_TYPES } from '@/lib/moduleManifest';

/**
 * Get all module definitions as a flat list (for sync and admin selectors).
 * @returns {Array<{page_path, page_name, module_id, module_name, module_type, icon, sort_order}>}
 */
export function getAllModuleDefinitions() {
  const list = [];
  for (const [pagePath, def] of Object.entries(MODULE_DEFINITIONS)) {
    for (const mod of def.modules) {
      list.push({
        page_path: pagePath,
        page_name: def.pageName,
        module_id: mod.id,
        module_name: mod.label,
        module_type: mod.module_type || MODULE_TYPES.FEATURE,
        icon: mod.icon || '',
        sort_order: mod.sort_order || 0,
      });
    }
  }
  return list;
}

/**
 * Get all modules (sub-features) for a specific page.
 * @param {string} pagePath
 * @returns {Array} Module objects with all original fields
 */
export function getModulesByPage(pagePath) {
  return MODULE_DEFINITIONS[pagePath]?.modules || [];
}

/**
 * Get all modules by type (METHOD, SECTION, CALCULATOR, TOOL, READING_MODULE).
 * @param {string} type — one of MODULE_TYPES
 * @returns {Array} Flat list of module definitions
 */
export function getModulesByType(type) {
  return getAllModuleDefinitions().filter(m => m.module_type === type);
}

/**
 * Get all multi-module page paths (pages that have sub-modules).
 * @returns {Array<string>}
 */
export function getMultiModulePagePaths() {
  return Object.keys(MODULE_DEFINITIONS);
}

/**
 * Get a single module by page path + module ID.
 * @param {string} pagePath
 * @param {string} moduleId
 * @returns {object|null}
 */
export function getModuleById(pagePath, moduleId) {
  return getModulesByPage(pagePath).find(m => m.id === moduleId) || null;
}

/**
 * Does this page have sub-modules (multi-module page)?
 * @param {string} pagePath
 * @returns {boolean}
 */
export function hasSubModules(pagePath) {
  return (MODULE_DEFINITIONS[pagePath]?.modules?.length || 0) > 0;
}

/**
 * Count total modules across all pages.
 * @returns {number}
 */
export function getTotalModuleCount() {
  return getAllModuleDefinitions().length;
}

/**
 * Build the canonical module list for backend sync (syncModuleRegistry).
 * @returns {Array<{page_path, page_name, module_id, module_name, module_type, icon, sort_order}>}
 */
export function buildModuleSyncList() {
  return getAllModuleDefinitions().map(m => ({
    page_path: m.page_path,
    page_name: m.page_name,
    module_id: m.module_id,
    module_name: m.module_name,
    module_type: m.module_type,
    icon: m.icon,
    sort_order: m.sort_order,
  }));
}