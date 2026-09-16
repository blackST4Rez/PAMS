// src/mock/mockApprovals.js
//
// Approvals engine seed data + helpers.
//
// This file defines:
//   • The shape of an approval request and its steps
//   • The configured chain for each workflow type
//   • Seed requests for testing the multi-level handoff
//   • Helpers for creating requests, advancing them, and reading history
//
// The engine is generic — it can drive disposal, transfer, or any future
// workflow. Which workflow is being approved is encoded in `entityName`.

/* ============================================================
   WORKFLOW TYPES
   Each type is a named process that flows through an approval chain.
   For now only disposal is implemented. More can be added later.
   ============================================================ */
export const APPROVAL_ENTITY_TYPES = {
    asset_disposal: {
        code: 'asset_disposal',
        label: 'Asset Disposal',
        description: 'Retire or scrap a municipal asset.',
    },
};

/* ============================================================
   CHAIN CONFIG
   Ordered list of role codes — index 0 is level 1, last entry is
   the final approver. Editable later via the /config page.
   ============================================================ */
export const MOCK_APPROVAL_CHAINS = {
    asset_disposal: ['ASSET_MANAGER', 'FINANCE_OFFICER'],
};

/* ============================================================
   STATUS VOCABULARY
   Plain text colors — no background fill. Rendered inline.
   ============================================================ */
export const REQUEST_STATUSES = {
    Pending: { label: 'Pending', color: 'text-yellow-300' },
    InReview: { label: 'In Review', color: 'text-blue-300' },
    Approved: { label: 'Approved', color: 'text-green-300' },
    Rejected: { label: 'Rejected', color: 'text-red-300' },
    Cancelled: { label: 'Cancelled', color: 'text-gray-300' },
};

export const STEP_STATUSES = {
    Pending: { label: 'Pending', color: 'text-yellow-300' },
    Approved: { label: 'Approved', color: 'text-green-300' },
    Rejected: { label: 'Rejected', color: 'text-red-300' },
    Cancelled: { label: 'Cancelled', color: 'text-gray-300' },
};

/* ============================================================
   SEED REQUESTS
   Three requests, one per interesting state:
     • req-001 — pending at Level 1 (Asset Manager's turn)
     • req-002 — pending at Level 2 (Finance Officer's turn)
     • req-003 — Rejected at Level 1 (terminal)
   ============================================================ */
export const MOCK_APPROVAL_REQUESTS = [
    {
        id: 'req-001',
        entityName: 'asset_disposal',
        entityId: 'a-002',
        title: 'Disposal: Fire Truck #1',
        requestedBy: 'admin.gaurishankar',
        createdAt: '2081-01-15T10:00:00Z',
        currentLevel: 1,
        totalLevels: 2,
        status: 'Pending',
        steps: [
            {
                level: 1,
                approverRoleCode: 'ASSET_MANAGER',
                status: 'Pending',
                actedBy: null,
                actedAt: null,
                remarks: null,
            },
            {
                level: 2,
                approverRoleCode: 'FINANCE_OFFICER',
                status: 'Pending',
                actedBy: null,
                actedAt: null,
                remarks: null,
            },
        ],
    },
    {
        id: 'req-002',
        entityName: 'asset_disposal',
        entityId: 'a-005',
        title: 'Disposal: School Bus #3',
        requestedBy: 'admin.gaurishankar',
        createdAt: '2081-01-14T09:00:00Z',
        currentLevel: 2,
        totalLevels: 2,
        status: 'InReview',
        steps: [
            {
                level: 1,
                approverRoleCode: 'ASSET_MANAGER',
                status: 'Approved',
                actedBy: 'admin.gaurishankar',
                actedAt: '2081-01-14T11:00:00Z',
                remarks: 'Confirmed end of life',
            },
            {
                level: 2,
                approverRoleCode: 'FINANCE_OFFICER',
                status: 'Pending',
                actedBy: null,
                actedAt: null,
                remarks: null,
            },
        ],
    },
    {
        id: 'req-003',
        entityName: 'asset_disposal',
        entityId: 'a-006',
        title: 'Disposal: Ward 1 Road Section',
        requestedBy: 'admin.gaurishankar',
        createdAt: '2081-01-13T08:30:00Z',
        currentLevel: 1,
        totalLevels: 2,
        status: 'Rejected',
        steps: [
            {
                level: 1,
                approverRoleCode: 'ASSET_MANAGER',
                status: 'Rejected',
                actedBy: 'admin.gaurishankar',
                actedAt: '2081-01-13T10:15:00Z',
                remarks: 'Asset still in serviceable condition',
            },
            {
                level: 2,
                approverRoleCode: 'FINANCE_OFFICER',
                status: 'Cancelled',
                actedBy: null,
                actedAt: null,
                remarks: null,
            },
        ],
    },
];

/* ============================================================
   HELPERS
   ============================================================ */

/* Generate a unique request id */
export const makeRequestId = () =>
    `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/*
  Build a fresh request from a chain config.
  Stamps each step with the role that owns it, all Pending.
  currentLevel starts at 1, status starts at Pending.
*/
export const buildRequestFromChain = ({
    entityName,
    entityId,
    title,
    requestedBy,
    chain,
}) => {
    if (!Array.isArray(chain) || chain.length === 0) {
        throw new Error('Approval chain is empty for this workflow');
    }

    const steps = chain.map((roleCode, i) => ({
        level: i + 1,
        approverRoleCode: roleCode,
        status: 'Pending',
        actedBy: null,
        actedAt: null,
        remarks: null,
    }));

    return {
        id: makeRequestId(),
        entityName,
        entityId,
        title,
        requestedBy,
        createdAt: new Date().toISOString(),
        currentLevel: 1,
        totalLevels: chain.length,
        status: 'Pending',
        steps,
    };
};

/*
  Does the given role participate in this request's current level?
  Used to filter "my queue".
*/
export const ownsCurrentLevel = (request, userRoles = []) => {
    if (!request || request.status === 'Approved' ||
        request.status === 'Rejected' || request.status === 'Cancelled') {
        return false;
    }
    const currentStep = request.steps.find(
        (s) => s.level === request.currentLevel
    );
    if (!currentStep) return false;
    return userRoles.includes(currentStep.approverRoleCode);
};

/*
  Is the request still actionable? (Not in a terminal state.)
*/
export const isActionable = (request) =>
    request &&
    (request.status === 'Pending' || request.status === 'InReview');

/*
  Look up the workflow definition by code.
*/
export const getEntityType = (code) =>
    APPROVAL_ENTITY_TYPES[code] ?? null;