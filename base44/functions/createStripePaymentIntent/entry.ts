import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Creates a Stripe Payment Intent for subscription payment
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { plan_id, duration, amount, currency } = await req.json();

    if (!plan_id || !duration || !amount) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return Response.json({ success: false, message: "Stripe credentials not configured" }, { status: 500 });
    }

    // Create Stripe Payment Intent
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        metadata: JSON.stringify({
          user_id: user.id,
          plan_id,
          duration,
          email: user.email
        }),
        description: `Subscription: ${plan_id} (${duration})`
      })
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      throw new Error(paymentIntent.error?.message || "Failed to create payment intent");
    }

    return Response.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
});