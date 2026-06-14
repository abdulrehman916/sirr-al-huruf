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

    const filePath = '/app/src/lib/permissionCodes.js';
    let content = await Deno.readTextFile(filePath);
    
    const escapedPath = page_path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `('${escapedPath}':\\s*{\\s*code:\\s*[^,]+,\\s*name:\\s*'[^']+',\\s*requiresPermission:\\s*)(true|false)`,
      'g'
    );
    
    const newContent = content.replace(regex, `$1${requiresPermission}`);
    
    if (newContent === content) {
      return Response.json({ error: 'Page path not found in permissionCodes.js' }, { status: 404 });
    }
    
    await Deno.writeTextFile(filePath, newContent);
    
    return Response.json({ 
      success: true, 
      message: `Page ${page_path} visibility updated to ${requiresPermission ? 'PRIVATE' : 'PUBLIC'}`,
      page_path,
      requiresPermission
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});