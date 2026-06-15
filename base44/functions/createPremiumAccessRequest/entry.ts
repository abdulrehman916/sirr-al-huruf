import { createClientFromRequest } from 'npm:@base44/sdk@0.8.32';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get current user (required)
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ 
        error: 'User must be logged in' 
      }, { status: 401 });
    }

    const { 
      page_path,
      page_name,
      plan_name,
      message
    } = await req.json();

    // Validate required fields
    if (!page_path || !plan_name) {
      return Response.json({ 
        error: 'Missing required fields: page_path, plan_name' 
      }, { status: 400 });
    }

    const now = new Date();
    const requestId = `REQ-${now.getTime()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create premium access request
    const request = await base44.entities.PremiumAccessRequest.create({
      request_id: requestId,
      user_id: user.id,
      user_name: user.full_name || '',
      user_email: user.email || '',
      page_path,
      page_name: page_name || '',
      plan_name,
      message: message || '',
      status: 'PENDING',
      requested_at: now.toISOString()
    });

    // Send WhatsApp notification to admin
    try {
      await base44.functions.invoke('sendWhatsAppNotification', {
        type: 'ADMIN_NEW_ACCESS_REQUEST',
        recipientPhone: Deno.env.get("ADMIN_WHATSAPP_NUMBER"),
        userName: user.full_name,
        userEmail: user.email,
        pageName: page_name,
        planName: plan_name
      });
    } catch (notifError) {
      console.error('WhatsApp notification failed:', notifError);
      // Don't fail the request if notification fails
    }

    return Response.json({ 
      success: true,
      request_id: requestId,
      message: 'Access request submitted successfully'
    });
  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});