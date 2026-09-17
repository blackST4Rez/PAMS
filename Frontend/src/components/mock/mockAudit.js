// src/mock/mockAudit.js
//
// Audit Trails vocabularies + helpers.
//
// The audit log itself is empty at boot. Every entry comes from a real
// write action in the app, logged via `logAuditEvent()` in AuditContext.

/* ============================================================
   ENTITY TYPES — used for filtering and display
   ============================================================ */
export const AUDIT_ENTITY_TYPES = [
    { code: 'asset', label: 'Asset', color: 'text-blue-300' },
    { code: 'user', label: 'User', color: 'text-purple-300' },
    { code: 'approval', label: 'Approval', color: 'text-yellow-300' },
    { code: 'maintenance', label: 'Maintenance', color: 'text-orange-300' },
    { code: 'valuation', label: 'Valuation', color: 'text-green-300' },
];

/* ============================================================
   ACTION TYPES — used for filtering and display
   ============================================================ */
export const AUDIT_ACTIONS = [
    { code: 'CREATE', label: 'Create' },
    { code: 'UPDATE', label: 'Update' },
    { code: 'DELETE', label: 'Delete' },
    { code: 'APPROVE', label: 'Approve' },
    { code: 'REJECT', label: 'Reject' },
    { code: 'CANCEL', label: 'Cancel' },
    { code: 'RUN', label: 'Run' },
    { code: 'LOG', label: 'Log' },
    { code: 'ASSIGN', label: 'Assign' },
];

export const getEntityMeta = (code) =>
    AUDIT_ENTITY_TYPES.find((e) => e.code === code) ?? {
        code,
        label: code,
        color: 'text-white/60',
    };

export const getActionMeta = (code) =>
    AUDIT_ACTIONS.find((a) => a.code === code) ?? { code, label: code };

/* ============================================================
   SEED — intentionally empty
   Real actions populate the log via logAuditEvent().
   ============================================================ */
export const MOCK_AUDIT_LOG = [];

/* ============================================================
   HELPERS
   ============================================================ */

export const makeAuditId = () =>
    `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const makeDiff = (oldObj, newObj) => {
    const before = {};
    const after = {};
    const keys = new Set([
        ...Object.keys(oldObj || {}),
        ...Object.keys(newObj || {}),
    ]);

    for (const k of keys) {
        const oldV = oldObj?.[k];
        const newV = newObj?.[k];
        if (JSON.stringify(oldV) !== JSON.stringify(newV)) {
            if (oldV !== undefined) before[k] = oldV;
            if (newV !== undefined) after[k] = newV;
        }
    }

    if (Object.keys(before).length === 0 && Object.keys(after).length === 0) {
        return null;
    }
    return { before, after };
};

export const fmtAuditTime = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};