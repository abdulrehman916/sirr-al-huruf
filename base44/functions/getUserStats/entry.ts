import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const stats = await Promise.all([
      base44.entities.ApprovedUser.filter({ status: 'ACTIVE' }).then(r => r.length),
      base44.entities.ApprovedUser.filter({ status: 'EXPIRED' }).then(r => r.length),
      base44.entities.ApprovedUser.filter({ status: 'BLOCKED' }).then(r => r.length),
      base44.entities.ApprovedUser.filter({ status: 'REMOVED' }).then(r => r.length),
      base44.entities.ApprovedUser.list().then(r => r.length),
      base44.entities.AccessCode.list().then(r => r.length),
      base44.entities.PagePermission.filter({ is_active: true }).then(r => r.length),
    ]);

    return Response.json({
      success: true,
      stats: {
        active_users: stats[0],
        expired_users: stats[1],
        blocked_users: stats[2],
        removed_users: stats[3],
        total_users: stats[4],
        total_codes: stats[5],
        active_permissions: stats[6],
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});