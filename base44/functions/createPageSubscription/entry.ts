import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { 
      user_id, 
      page_path, 
      page_name, 
      plan_name, 
      price, 
      currency,
      payment_method,
      transaction_id,
      payment_proof_url
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

    // Create subscription record (PENDING status)
    const subscription = await base44.entities.Subscription.create({
      subscription_id: subscriptionId,
      user_id: user_id,
      page_path: page_path,
      page_name: page_name,
      plan_name: plan_name,
      start_date: now.toISOString(),
      expiry_date: expiryDate ? expiryDate.toISOString() : null,
      status: "PENDING", // Requires admin approval
      granted_by: "system",
      granted_at: now.toISOString(),
      notes: `Payment via ${payment_method || "Unknown"}. Transaction: ${transaction_id || "N/A"}`
    });

    // Store payment proof URL in a separate field or notes
    if (payment_proof_url) {
      await base44.entities.Subscription.update(subscription.id, {
        notes: `Payment: ${payment_method || "Unknown"}. TXN: ${transaction_id || "N/A"}. Proof: ${payment_proof_url}`
      });
    }

    return Response.json({
      success: true,
      message: "Subscription created successfully. Awaiting admin approval.",
      subscription_id: subscriptionId
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});