import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import crypto from 'node:crypto';

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
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      page_path,
      page_name,
      plan_name,
      amount
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ 
        success: false, 
        message: "Missing payment details" 
      }, { status: 400 });
    }

    // Verify signature
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ 
        success: false, 
        message: "Invalid payment signature" 
      }, { status: 400 });
    }

    // Payment verified - create subscription
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

    // Create active subscription
    const subscription = await base44.entities.Subscription.create({
      subscription_id: subscriptionId,
      user_id: user.id,
      page_path: page_path,
      page_name: page_name,
      plan_name: plan_name,
      start_date: now.toISOString(),
      expiry_date: expiryDate ? expiryDate.toISOString() : null,
      status: "ACTIVE",
      granted_by: "system",
      granted_at: now.toISOString(),
      notes: `Razorpay Payment: ${razorpay_payment_id}. Order: ${razorpay_order_id}. Amount: ₹${amount}`
    });

    return Response.json({
      success: true,
      message: "Payment successful! Access granted.",
      subscription_id: subscriptionId,
      payment_id: razorpay_payment_id
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});