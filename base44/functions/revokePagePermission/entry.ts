import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin/owner access
    const user = await base44.auth.me();
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return Response.json({ error: 'Unauthorized - Admin/Owner access required' }, { status: 403 });
    }

    const { permission_id, reason } = await req.json();

    if (!permission_id) {
      return Response.json({ error: 'Permission ID required' }, { status: 400 });
    }

    const now = new Date();

    // Find permission
    const permissions = await base44.entities.PagePermission.filter({ permission_id: permission_id });
    if (permissions.length === 0) {
      return Response.json({ error: 'Permission not found' }, { status: 404 });
    }

    const permission = permissions[0];

    // Revoke permission
    await base44.entities.PagePermission.update(permission.id, {
      is_revoked: true,
      revoked_by: user.id,
      revoked_at: now.toISOString(),
      revoked_reason: reason || 'No reason provided',
      is_active: false
    });

    // Update user profile
    const profiles = await base44.entities.UserAccessProfile.filter({ user_id: permission.user_id });
    if (profiles.length > 0) {
      const profile = profiles[0];
      await base44.entities.UserAccessProfile.update(profile.id, {
        active_permissions: Math.max(0, (profile.active_permissions || 0) - 1)
      });
    }

    return Response.json({
      success: true,
      message: 'Permission revoked successfully',
      permission_id: permission_id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});