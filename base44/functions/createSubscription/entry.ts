import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { user_id, plan_name, notes } = await req.json();

    const plan = {
      'TRIAL': { days: 7 },
      '30_DAY': { days: 30 },
      '60_DAY': { days: 60 },
      '90_DAY': { days: 90 },
      'LIFETIME': { days: null }
    }[plan_name];

    if (!plan) {
      return new Response(JSON.stringify({ error: 'Invalid plan name' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const now = new Date();
    const expiry_date = plan.days ? new Date(now.getTime() + (plan.days * 24 * 60 * 60 * 1000)).toISOString() : null;

    const subscriptionData = {
      user_id,
      plan_name,
      notes,
      start_date: now.toISOString(),
      expiry_date,
      status: 'ACTIVE',
      granted_by: user.id,
      granted_at: now.toISOString(),
    };

    const newSubscription = await base44.entities.Subscription.create(subscriptionData);

    return new Response(JSON.stringify(newSubscription), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});