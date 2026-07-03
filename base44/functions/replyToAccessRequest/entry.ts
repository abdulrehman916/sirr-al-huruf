import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { request_id, session_id, message } = await req.json();

    if (!request_id || !session_id || !message?.trim()) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the request belongs to this session
    const requests = await base44.asServiceRole.entities.AccessRequest.filter(
      { request_id },
      null,
      1
    );

    if (!requests || requests.length === 0) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    const request = requests[0];
    if (request.session_id !== session_id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create the user message
    const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await base44.asServiceRole.entities.AccessRequestMessage.create({
      message_id: messageId,
      request_id,
      sender_type: "USER",
      sender_id: session_id,
      sender_name: "User",
      message: message.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    });

    return Response.json({ success: true, message_id: messageId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});