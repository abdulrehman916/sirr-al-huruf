import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const admin = await base44.auth.me();
    if (!admin || admin.role !== 'admin') {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { request_id, duration } = await req.json();
    if (!request_id) return Response.json({ success: false, error: "Missing request_id" }, { status: 400 });

    // Find the request
    const requests = await base44.asServiceRole.entities.AccessRequest.filter({ request_id });
    const accessReq = requests[0];
    if (!accessReq) return Response.json({ success: false, error: "Request not found" }, { status: 404 });

    // Calculate expiry
    const durationDays = {
      "1_MONTH": 30,
      "3_MONTHS": 90,
      "6_MONTHS": 180,
      "PERMANENT": 36500,
    }[duration || "1_MONTH"] || 30;

    const now = new Date();
    const expiry = new Date(now.getTime() + durationDays * 86400000).toISOString();

    // Grant permission if user_id exists
    if (accessReq.user_id) {
      const permId = `PERM-${Date.now()}`;
      const permCode = `${accessReq.page_path.replace(/\//g, '').replace(/-/g, '_').toUpperCase()}_ACCESS`;

      await base44.asServiceRole.entities.PagePermission.create({
        permission_id: permId,
        user_id: accessReq.user_id,
        page_path: accessReq.page_path,
        page_name: accessReq.page_name,
        permission_code: permCode,
        granted_by: admin.id,
        granted_at: now.toISOString(),
        start_date: now.toISOString(),
        expiry_date: expiry,
        is_active: true,
        is_revoked: false,
        notes: `Approved via access request ${request_id}`,
      });
    }

    // Update request status
    await base44.asServiceRole.entities.AccessRequest.update(accessReq.id, {
      status: "APPROVED",
      approved_by: admin.id,
      approved_at: now.toISOString(),
      access_duration: duration || "1_MONTH",
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});