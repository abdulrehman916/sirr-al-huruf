import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const admin = await base44.auth.me();
    if (!admin || admin.role !== 'admin') {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { request_id, reject, rejection_reason } = await req.json();
    if (!request_id) return Response.json({ success: false, error: "Missing request_id" }, { status: 400 });

    const requests = await base44.asServiceRole.entities.AccessRequest.filter({ request_id });
    const accessReq = requests[0];
    if (!accessReq) return Response.json({ success: false, error: "Request not found" }, { status: 404 });

    if (reject) {
      await base44.asServiceRole.entities.AccessRequest.update(accessReq.id, {
        status: "REJECTED",
        approved_by: admin.id,
        approved_at: new Date().toISOString(),
        rejection_reason: rejection_reason || "No reason provided",
      });
    } else {
      // Mark as APPROVED — admin manually edits the user's Reading Code to add the feature.
      // No automatic permission grant; the Reading Code system handles access.
      await base44.asServiceRole.entities.AccessRequest.update(accessReq.id, {
        status: "APPROVED",
        approved_by: admin.id,
        approved_at: new Date().toISOString(),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});