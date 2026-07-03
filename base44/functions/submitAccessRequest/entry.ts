import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // User may be a guest (not logged in) — don't fail if auth.me() throws
    let user = null;
    try { user = await base44.auth.me(); } catch (e) { /* guest user */ }

    const { name, phone, email, page_path, page_name, message, session_id, existing_code } = await req.json();

    if (!page_path) {
      return Response.json({ success: false, error: "Missing page_path" }, { status: 400 });
    }

    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    await base44.asServiceRole.entities.AccessRequest.create({
      request_id: requestId,
      user_id: user?.id || null,
      session_id: session_id || null,
      existing_code: existing_code || null,
      name: name || (user?.full_name || "Guest User"),
      phone: phone || "",
      email: email || (user?.email || ""),
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