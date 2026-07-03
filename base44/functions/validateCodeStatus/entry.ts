import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Validate code status for a guest session.
 * Called by the client on app load to check if redeemed codes are still valid.
 * Returns list of codes bound to this session with their current status.
 * Client removes localStorage permissions for codes that are deleted, disabled, or expired.
 *
 * Input:  { session_id }
 * Output: { success, codes: [{ code, status, expiry_date, page_paths }] }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { session_id } = await req.json();

    if (!session_id) return Response.json({ error: 'session_id required' }, { status: 400 });

    // Find all codes bound to this session
    const codes = await base44.asServiceRole.entities.AccessCode.filter(
      { used_by_user_id: session_id },
      '-created_date',
      100
    );

    const now = new Date();
    const results = (codes || []).map((c: any) => {
      let status = 'active';
      if (c.is_disabled) status = 'disabled';
      else if (c.expiry_date && new Date(c.expiry_date) < now) status = 'expired';

      return {
        code: c.code,
        status,
        expiry_date: c.expiry_date,
        page_paths: c.page_paths || [],
        is_disabled: c.is_disabled || false,
      };
    });

    return Response.json({
      success: true,
      codes: results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});