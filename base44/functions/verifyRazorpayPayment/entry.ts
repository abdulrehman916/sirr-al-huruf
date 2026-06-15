import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import crypto from 'node:crypto';

// Verifies Razorpay payment signature + activates subscription with page permissions
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan_id,
      duration,
      amount,
      currency
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ success: false, message: "Missing payment details" }, { status: 400 });
    }

    // Verify signature
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return Response.json({ success: false, message: "Razorpay secret not configured" }, { status: 500 });
    }
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    // Payment verified - activate subscription
    const activationResult = await base44.functions.invoke('activateSubscriptionPlan', {
      plan_id,
      duration,
      amount,
      currency: currency || 'INR',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

    if (!activationResult.data?.success) {
      throw new Error(activationResult.data?.error || 'Failed to activate subscription');
    }

    return Response.json({
      success: true,
      message: "Payment successful! Access granted.",
      payment_id: razorpay_payment_id,
      subscription_id: activationResult.data.subscription_id,
      granted_pages: activationResult.data.granted_pages
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
});