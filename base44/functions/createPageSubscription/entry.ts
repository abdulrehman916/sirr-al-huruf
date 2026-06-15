import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const { 
      user_id, 
      page_path, 
      page_name, 
      plan_name, 
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await req.json();

    // Validate required fields
    if (!user_id || !page_path || !plan_name) {
      return Response.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }

    const now = new Date();
    const subscriptionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expiry based on plan
    let expiryDate = null;
    if (plan_name === "1_MONTH") {
      expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (plan_name === "6_MONTHS") {
      expiryDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    } else if (plan_name === "1_YEAR") {
      expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
    // LIFETIME has null expiry

    // Create subscription record (ACTIVE immediately after Razorpay payment)
    const subscription = await base44.entities.Subscription.create({
      subscription_id: subscriptionId,
      user_id: user_id,
      user_name: user.full_name || "",
      user_phone: user.mobile || "",
      user_email: user.email || "",
      page_path: page_path,
      page_name: page_name,
      plan_name: plan_name,
      amount: amount || 0,
      currency: "INR",
      razorpay_order_id: razorpay_order_id || "",
      razorpay_payment_id: razorpay_payment_id || "",
      razorpay_signature: razorpay_signature || "",
      start_date: now.toISOString(),
      expiry_date: expiryDate ? expiryDate.toISOString() : null,
      status: "ACTIVE", // Active immediately after payment
      granted_by: "system",
      granted_at: now.toISOString(),
      notes: `Razorpay Payment: ${razorpay_payment_id}. Order: ${razorpay_order_id}`
    });

    // Send WhatsApp notification to user
    try {
      const durationMap = {
        "1_MONTH": "1 Month",
        "6_MONTHS": "6 Months",
        "1_YEAR": "1 Year",
        "LIFETIME": "Lifetime"
      };
      
      await base44.functions.invoke('sendWhatsAppNotification', {
        type: 'SUBSCRIPTION_PURCHASED',
        recipientPhone: user.mobile || "",
        userName: user.full_name || user.email || "Valued User",
        pageName: page_name,
        duration: durationMap[plan_name] || plan_name,
        expiryDate: expiryDate ? expiryDate.toISOString() : null
      });
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError.message);
      // Don't fail the subscription if WhatsApp fails
    }

    return Response.json({
      success: true,
      message: "Subscription activated successfully",
      subscription_id: subscriptionId
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});