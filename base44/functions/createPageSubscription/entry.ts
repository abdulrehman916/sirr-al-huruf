import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { page_path, page_name, plan_name, duration_days } = await req.json();

    if (!page_path || !plan_name || !duration_days) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate subscription ID
    const count = await base44.entities.Subscription.list();
    const subscription_id = `SUB-${String(count.length + 1).padStart(6, '0')}`;

    // Calculate dates
    const now = new Date();
    const start_date = now.toISOString();
    const expiry_date = duration_days === 'LIFETIME' 
      ? null 
      : new Date(now.getTime() + (duration_days * 24 * 60 * 60 * 1000)).toISOString();

    // Create subscription record
    const subscription = await base44.entities.Subscription.create({
      subscription_id,
      user_id: user.id,
      plan_name,
      page_path,
      page_name,
      start_date,
      expiry_date,
      status: 'ACTIVE',
      granted_by: user.id,
      granted_at: start_date
    });

    return Response.json({ 
      success: true, 
      subscription_id,
      expiry_date,
      message: 'Subscription activated successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});