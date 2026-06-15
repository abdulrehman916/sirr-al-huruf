import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_id, page_path } = await req.json();

    if (!user_id || !page_path) {
      return Response.json({ 
        success: false, 
        message: "User ID and page path required" 
      }, { status: 400 });
    }

    // Security: only allow checking own subscriptions or admin access
    const user = await base44.auth.me();
    if (!user || (user.id !== user_id && user.role !== 'admin')) {
      return Response.json({
        success: false,
        message: "Access denied"
      }, { status: 403 });
    }

    // Find active subscriptions for this user and page
    const subscriptions = await base44.entities.Subscription.filter({
      user_id: user_id,
      page_path: page_path,
      status: "ACTIVE"
    });

    if (subscriptions.length === 0) {
      return Response.json({
        success: true,
        has_subscription: false,
        message: "No active subscription found"
      });
    }

    // Check if any subscription is still valid
    const now = new Date();
    const validSubscription = subscriptions.find(sub => {
      if (!sub.expiry_date) {
        // LIFETIME subscription
        return true;
      }
      return new Date(sub.expiry_date) > now;
    });

    if (validSubscription) {
      return Response.json({
        success: true,
        has_subscription: true,
        subscription: validSubscription,
        message: "Active subscription found"
      });
    } else {
      // All subscriptions expired
      return Response.json({
        success: true,
        has_subscription: false,
        expired: true,
        message: "Subscription has expired"
      });
    }

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});