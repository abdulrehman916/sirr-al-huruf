import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Verifies Stripe payment + activates subscription
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { 
      payment_intent_id,
      plan_id,
      duration,
      amount,
      currency
    } = await req.json();

    if (!payment_intent_id) {
      return Response.json({ success: false, message: "Missing payment intent ID" }, { status: 400 });
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return Response.json({ success: false, message: "Stripe credentials not configured" }, { status: 500 });
    }

    // Fetch payment intent status
    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${payment_intent_id}`, {
      headers: {
        "Authorization": `Bearer ${stripeSecret}`
      }
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      throw new Error(paymentIntent.error?.message || "Failed to fetch payment intent");
    }

    if (paymentIntent.status !== 'succeeded') {
      return Response.json({ 
        success: false, 
        message: `Payment status: ${paymentIntent.status}` 
      }, { status: 400 });
    }

    // Payment succeeded - activate subscription (asServiceRole bypasses admin check)
    const activationResult = await base44.asServiceRole.functions.invoke('activateSubscriptionPlan', {
      plan_id,
      duration,
      amount,
      currency: currency || 'USD',
      payment_id: paymentIntent.id,
      order_id: paymentIntent.id
    });

    if (!activationResult.data?.success) {
      throw new Error(activationResult.data?.error || 'Failed to activate subscription');
    }

    return Response.json({
      success: true,
      message: "Payment successful! Access granted.",
      payment_id: paymentIntent.id,
      charge_id: paymentIntent.charges?.data?.[0]?.id,
      subscription_id: activationResult.data.subscription_id,
      granted_pages: activationResult.data.granted_pages
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
});