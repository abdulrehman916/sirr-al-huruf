import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { page_path, requiresPermission } = await req.json();

    if (!page_path || typeof requiresPermission !== 'boolean') {
      return Response.json({ error: 'Invalid input: page_path and requiresPermission (boolean) required' }, { status: 400 });
    }

    // Get permission config from permissionCodes.js to get page_name
    const permissionCodesModule = await import('npm:@base44/sdk@0.8.31');
    // Use hardcoded page names mapping for simplicity
    const pageNames = {
      '/': 'Home',
      '/abjad': 'Abjad Kabir',
      '/anasir': 'Anasir',
      '/hadim': 'Hadim',
      '/mizaan9': 'Mizan 9',
      '/magic-sqayer': 'Magic Sqayer',
      '/vefkin-yapilisi': 'Vefkin Yapilisi',
      '/basthul-huroof-2': 'Bast Huroof',
      '/faal-hasrath': 'Faal Hasrath',
      '/plants': 'Plants',
      '/evil-jinn': 'Evil Jinn',
      '/holy-names': 'Holy Names',
      '/astro-clock': 'Astro Clock',
      '/admin/page-permissions': 'Page Permissions',
      '/admin/support': 'Support Management',
      '/admin/permissions': 'Permission Management',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/faal-chob-upload': 'Faal Chob Upload',
      '/hierarchy-audit': 'Hierarchy Audit',
      '/pipeline-test': 'Pipeline Test',
      '/audit-report': 'Audit Report',
      '/istintak-discovery': 'Istintak Discovery',
      '/manuscript-pipeline': 'Manuscript Pipeline',
      '/abjad-bast-audit': 'Abjad Bast Audit',
      '/mizan-calculation-audit': 'Mizan Calculation Audit',
      '/vefk-audit': 'Vefk Audit',
      '/method-classification': 'Method Classification',
      '/manuscript-verification': 'Manuscript Verification',
      '/manuscript-analysis': 'Manuscript Analysis',
      '/vefk-model-verification': 'Vefk Model Verification',
      '/rubai-verification': 'Rubai Verification',
      '/manuscript-audit': 'Manuscript Audit',
      '/manuscript-audit-full': 'Manuscript Audit Full',
      '/manuscript-action-finder': 'Manuscript Action Finder',
      '/manuscript-library': 'Manuscript Library',
      '/manuscript-final-audit': 'Manuscript Final Audit',
      '/astrology-only-audit': 'Astrology Only Audit',
      '/manuscript-browser': 'Manuscript Browser',
      '/manuscript-rule-audit': 'Manuscript Rule Audit',
      '/manuscript-search': 'Manuscript Search',
      '/manazil-quality-audit': 'Manazil Quality Audit',
      '/manuscript-completion-report': 'Manuscript Completion Report',
      '/customer-service': 'Customer Service',
      '/admin/test': 'Admin Test'
    };

    const page_name = pageNames[page_path] || page_path;

    // Upsert: try to find existing record, update or create
    const existingConfigs = await base44.entities.PageVisibilityConfig.filter({ page_path });
    
    const now = new Date().toISOString();
    
    if (existingConfigs && existingConfigs.length > 0) {
      // Update existing
      await base44.entities.PageVisibilityConfig.update(existingConfigs[0].id, {
        requires_permission: requiresPermission,
        updated_by: user.id,
        updated_at: now
      });
      
      return Response.json({ 
        success: true, 
        message: `Page ${page_path} visibility updated to ${requiresPermission ? 'PRIVATE' : 'PUBLIC'}`,
        page_path,
        requiresPermission,
        action: 'updated'
      });
    } else {
      // Create new
      await base44.entities.PageVisibilityConfig.create({
        page_path,
        page_name,
        requires_permission: requiresPermission,
        admin_only: page_path.startsWith('/admin/'),
        updated_by: user.id,
        updated_at: now
      });
      
      return Response.json({ 
        success: true, 
        message: `Page ${page_path} visibility created as ${requiresPermission ? 'PRIVATE' : 'PUBLIC'}`,
        page_path,
        requiresPermission,
        action: 'created'
      });
    }

  } catch (error) {
    console.error('updatePageVisibility error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});