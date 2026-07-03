import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Delete an access code securely.
 * Appends a DELETED audit entry before deletion.
 * Note: Client-side validateCodeStatus removes localStorage permissions for deleted codes.
 *
 * Input:  { code_id }
 * Output: { success, message }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { code_id } = await req.json();
    if (!code_id) return Response.json({ error: 'code_id required' }, { status: 400 });

    const code = await base44.asServiceRole.entities.AccessCode.get(code_id);
    if (!code) return Response.json({ error: 'Code not found' }, { status: 404 });

    // Append DELETED audit entry before deletion
    const auditEntry = {
      action: 'DELETED',
      timestamp: new Date().toISOString(),
      admin_id: user.id,
      details: `Code deleted by admin. All permissions revoked.`,
    };

    await base44.asServiceRole.entities.AccessCode.update(code_id, {
      audit_log: [...(code.audit_log || []), auditEntry],
    });

    // Now delete the code
    await base44.asServiceRole.entities.AccessCode.delete(code_id);

    return Response.json({
      success: true,
      message: `Code "${code.code}" deleted. All permissions revoked.`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});