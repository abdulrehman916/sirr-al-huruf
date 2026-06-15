import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Admin-only: refund, cancel, or extend a subscription
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const { 
      subscription_id,
      action,        // "refund" | "cancel" | "extend"
      refund_amount,
      refund_reason,
      extend_days
    } = await req.json();

    if (!subscription_id || !action) {
      return Response.json({ success: false, message: "subscription_id and action required" }, { status: 400 });
    }

    // Find subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({ subscription_id });
    if (subs.length === 0) {
      return Response.json({ success: false, message: "Subscription not found" }, { status: 404 });
    }
    const sub = subs[0];

    const now = new Date().toISOString();

    if (action === 'cancel') {
      await base44.asServiceRole.entities.Subscription.update(sub.id, {
        status: 'CANCELLED',
        last_modified_by: user.id,
        last_modified_at: now,
        notes: (sub.notes || '') + `\n[ ${now} ] Cancelled by ${user.email}`
      });

      // Revoke all associated page permissions
      const perms = await base44.asServiceRole.entities.PagePermission.filter({
        user_id: sub.user_id,
        page_path: sub.page_path,
        is_active: true
      });

      for (const perm of perms) {
        await base44.asServiceRole.entities.PagePermission.update(perm.id, {
          is_active: false,
          is_revoked: true,
          revoked_by: user.id,
          revoked_at: now,
          revoked_reason: 'Subscription cancelled'
        });
      }

      return Response.json({ success: true, message: 'Subscription cancelled', status: 'CANCELLED' });
    }

    if (action === 'refund') {
      if (!refund_amount || refund_amount <= 0) {
        return Response.json({ success: false, message: "Valid refund_amount required" }, { status: 400 });
      }

      // Process refund via gateway
      let refundStatus = 'pending';
      const gateway = sub.payment_gateway || 'razorpay';

      if (gateway === 'razorpay' && sub.razorpay_payment_id) {
        const keyId = Deno.env.get("RAZORPAY_KEY_ID");
        const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
        
        if (keyId && keySecret) {
          const auth = btoa(`${keyId}:${keySecret}`);
          const refundResponse = await fetch(`https://api.razorpay.com/v1/refunds`, {
            method: "POST",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              payment_id: sub.razorpay_payment_id,
              amount: Math.round(refund_amount * 100),
              notes: { reason: refund_reason || 'Admin refund' }
            })
          });
          const refundData = await refundResponse.json();
          if (refundResponse.ok) {
            refundStatus = 'completed';
            await base44.asServiceRole.entities.Subscription.update(sub.id, {
              refund_id: refundData.id,
              refund_status: 'completed',
              refund_amount: refund_amount,
              refund_reason: refund_reason || '',
              status: 'REFUNDED',
              last_modified_by: user.id,
              last_modified_at: now,
              notes: (sub.notes || '') + `\n[ ${now} ] Refunded ₹${refund_amount} via Razorpay. ID: ${refundData.id}. Reason: ${refund_reason || 'N/A'}`
            });
          } else {
            refundStatus = 'failed';
          }
        }
      } else if (gateway === 'stripe' && sub.stripe_charge_id) {
        const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
        
        if (stripeSecret) {
          const refundResponse = await fetch("https://api.stripe.com/v1/refunds", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${stripeSecret}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              charge: sub.stripe_charge_id,
              amount: Math.round(refund_amount * 100),
              reason: refund_reason || 'requested_by_customer'
            })
          });
          const refundData = await refundResponse.json();
          if (refundResponse.ok) {
            refundStatus = 'completed';
            await base44.asServiceRole.entities.Subscription.update(sub.id, {
              refund_id: refundData.id,
              refund_status: 'completed',
              refund_amount: refund_amount,
              refund_reason: refund_reason || '',
              status: 'REFUNDED',
              last_modified_by: user.id,
              last_modified_at: now,
              notes: (sub.notes || '') + `\n[ ${now} ] Refunded ${refund_amount} ${sub.currency} via Stripe. ID: ${refundData.id}. Reason: ${refund_reason || 'N/A'}`
            });
          } else {
            refundStatus = 'failed';
          }
        }
      }

      if (refundStatus !== 'completed') {
        // Manual refund recorded but gateway refund failed/not attempted
        await base44.asServiceRole.entities.Subscription.update(sub.id, {
          refund_status: refundStatus,
          refund_amount: refund_amount,
          refund_reason: refund_reason || '',
          last_modified_by: user.id,
          last_modified_at: now,
          notes: (sub.notes || '') + `\n[ ${now} ] Manual refund recorded: ${refund_amount}. Reason: ${refund_reason || 'N/A'}`
        });
      }

      return Response.json({ 
        success: true, 
        message: 'Refund processed', 
        refund_status: refundStatus,
        refund_id: refundStatus === 'completed' ? 'gateway_processed' : 'manual_recorded'
      });
    }

    if (action === 'extend') {
      if (!extend_days || extend_days <= 0) {
        return Response.json({ success: false, message: "Valid extend_days required" }, { status: 400 });
      }

      const currentExpiry = sub.expiry_date ? new Date(sub.expiry_date) : new Date();
      const newExpiry = new Date(currentExpiry.getTime() + extend_days * 86400000);

      await base44.asServiceRole.entities.Subscription.update(sub.id, {
        expiry_date: newExpiry.toISOString(),
        last_modified_by: user.id,
        last_modified_at: now,
        notes: (sub.notes || '') + `\n[ ${now} ] Extended by ${extend_days} days by ${user.email}. New expiry: ${newExpiry.toISOString()}`
      });

      // Also extend associated page permissions
      const perms = await base44.asServiceRole.entities.PagePermission.filter({
        user_id: sub.user_id,
        page_path: sub.page_path,
        is_active: true
      });

      for (const perm of perms) {
        const permNewExpiry = perm.expiry_date ? new Date(perm.expiry_date) : new Date();
        const permExtendedExpiry = new Date(permNewExpiry.getTime() + extend_days * 86400000);
        
        await base44.asServiceRole.entities.PagePermission.update(perm.id, {
          expiry_date: permExtendedExpiry.toISOString(),
          extended_count: (perm.extended_count || 0) + 1,
          last_extended_at: now,
          last_extended_by: user.id
        });
      }

      return Response.json({ 
        success: true, 
        message: `Extended by ${extend_days} days`, 
        new_expiry: newExpiry.toISOString() 
      });
    }

    return Response.json({ success: false, message: "Invalid action" }, { status: 400 });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
});