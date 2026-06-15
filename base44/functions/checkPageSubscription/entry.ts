import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { page_path } = await req.json();

    if (!page_path) {
      return Response.json({ error: 'page_path required' }, { status: 400 });
    }

    // Get all subscriptions for this user and page
    const allSubs = await base44.entities.Subscription.list();
    const pageSubs = allSubs.filter(s => 
      s.user_id === user.id && 
      s.page_path === page_path &&
      s.status === 'ACTIVE'
    );

    // Check for active subscription
    const now = new Date();
    const activeSub = pageSubs.find(sub => {
      if (sub.plan_name === 'LIFETIME') return true;
      if (!sub.expiry_date) return false;
      return new Date(sub.expiry_date) > now;
    });

    if (activeSub) {
      return Response.json({
        has_access: true,
        subscription: activeSub,
        expiry_date: activeSub.expiry_date,
        plan_name: activeSub.plan_name
      });
    }

    return Response.json({
      has_access: false,
      message: 'No active subscription found'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});