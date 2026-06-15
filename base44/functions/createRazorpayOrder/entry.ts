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

    const { amount, page_path, page_name, plan_name } = await req.json();

    if (!amount || !page_path || !plan_name) {
      return Response.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }

    // Create Razorpay order
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      return Response.json({ 
        success: false, 
        message: "Razorpay credentials not configured" 
      }, { status: 500 });
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `sub_${Date.now()}`,
      notes: {
        user_id: user.id,
        page_path,
        page_name,
        plan_name
      }
    };

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const order = await response.json();

    if (!response.ok) {
      throw new Error(order.error?.description || "Failed to create order");
    }

    return Response.json({
      success: true,
      order_id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      key_id: keyId
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});