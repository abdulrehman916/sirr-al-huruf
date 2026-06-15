import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const { name, phone, email, page_path, page_name, message } = await req.json();

    if (!name || !phone || !email || !page_path) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    await base44.asServiceRole.entities.AccessRequest.create({
      request_id: requestId,
      user_id: user?.id || null,
      name,
      phone,
      email,
      page_path,
      page_name: page_name || page_path,
      message: message || "",
      status: "PENDING",
      requested_at: new Date().toISOString(),
    });

    return Response.json({ success: true, request_id: requestId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});