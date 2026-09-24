// src/mock/mockRoles.js
//
// Role definitions + permission vocabularies.
//
// These are seeded into localStorage on first load (see RolesContext).
// From then on, edits to a role's permission set come from localStorage
// and take effect immediately for every user holding that role — no
// reload, no re-login, exactly as the MD requires.
//
// Structure:
//   PERMISSIONS       — every permission code in the system, with label + group
//   SEED_ROLES        — the six roles the MD defines, each with its permissions
//   DEFAULT_ROLE_CODE — fallback role for new self-registrations
//
// Role codes are the same ones the MD uses throughout:
//   SYS_ADMIN, ASSET_MANAGER, FINANCE_OFFICER, FIELD_OFFICER, AUDITOR, PUBLIC_USER

/* ============================================================
   PERMISSION VOCABULARY
   Every permission code the system recognises, grouped for
   display on the Roles page. Order within a group is the order
   they'll appear in the UI.
   ============================================================ */
export const PERMISSIONS = [
    // Assets
    { code: 'asset.view', label: 'View assets', group: 'Assets' },
    { code: 'asset.create', label: 'Register assets', group: 'Assets' },
    { code: 'asset.edit', label: 'Edit assets', group: 'Assets' },
    { code: 'asset.delete', label: 'Soft-delete assets', group: 'Assets' },
    { code: 'asset.approve', label: 'Approve new assets', group: 'Assets' },
    { code: 'asset.transfer', label: 'Transfer assets', group: 'Assets' },

    // GIS
    { code: 'gis.view', label: 'View GIS map', group: 'GIS' },

    // Maintenance
    { code: 'maintenance.view', label: 'View maintenance', group: 'Maintenance' },
    { code: 'maintenance.create', label: 'Log maintenance', group: 'Maintenance' },

    // Valuation
    { code: 'valuation.view', label: 'View valuation', group: 'Valuation' },
    { code: 'valuation.edit', label: 'Run depreciation / revalue', group: 'Valuation' },

    // Verification
    { code: 'verification.verify', label: 'Field-verify assets', group: 'Verification' },

    // Disposal
    { code: 'disposal.create', label: 'Request disposal', group: 'Disposal' },
    { code: 'disposal.approve', label: 'Approve disposal (legacy — chain decides)', group: 'Disposal' },

    // Reports
    { code: 'report.view', label: 'View reports', group: 'Reports' },
    { code: 'report.export', label: 'Export reports', group: 'Reports' },

    // Audit
    { code: 'audit.view', label: 'View audit trail', group: 'Audit' },

    // Admin
    { code: 'admin.users', label: 'Manage users', group: 'Administration' },
    { code: 'admin.roles', label: 'Manage roles', group: 'Administration' },
    { code: 'admin.config', label: 'System configuration', group: 'Administration' },
];

/* All permission codes, flat — useful for validation */
export const ALL_PERMISSION_CODES = PERMISSIONS.map((p) => p.code);

/* Group order for display */
export const PERMISSION_GROUPS = [
    'Assets',
    'GIS',
    'Maintenance',
    'Valuation',
    'Verification',
    'Disposal',
    'Reports',
    'Audit',
    'Administration',
];

/* ============================================================
   ROLE DEFINITIONS (seed)
   The six roles from the MD §3, each with its exact permission
   set. Order matches the MD's presentation order.
   ============================================================ */

const SYS_ADMIN_PERMS = [
    'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
    'asset.approve', 'asset.transfer',
    'gis.view',
    'maintenance.view', 'maintenance.create',
    'valuation.view', 'valuation.edit',
    'verification.verify',
    'disposal.create', 'disposal.approve',
    'report.view', 'report.export',
    'audit.view',
    'admin.users', 'admin.roles', 'admin.config',
];

const ASSET_MANAGER_PERMS = [
    'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
    'asset.approve', 'asset.transfer',
    'gis.view',
    'maintenance.view', 'maintenance.create',
    'verification.verify',
    'disposal.create',
    'report.view', 'report.export',
];

const FINANCE_OFFICER_PERMS = [
    'asset.view',
    'valuation.view', 'valuation.edit',
    'report.view', 'report.export',
];

const FIELD_OFFICER_PERMS = [
    'asset.view', 'asset.create', 'asset.edit',
    'gis.view',
    'maintenance.view', 'maintenance.create',
    'verification.verify',
];

const AUDITOR_PERMS = [
    'asset.view',
    'gis.view',
    'maintenance.view',
    'valuation.view',
    'report.view', 'report.export',
    'audit.view',
];

const PUBLIC_USER_PERMS = [
    'asset.view',
    'gis.view',
];

/*
  SEED_ROLES — the six roles, in the order the MD presents them.

  isSystem: true  → the role cannot be deleted from the UI
                   (it maps to a real code elsewhere in the app).
                   Permissions ARE still editable, per the MD.

  isDeletable is derived: any role created later via the UI can be
  deleted if no user holds it. The six seeds are always `isSystem`.
*/
export const SEED_ROLES = [
    {
        code: 'SYS_ADMIN',
        label: 'System Admin',
        description: 'Full access to every module and administrative function.',
        isSystem: true,
        permissions: SYS_ADMIN_PERMS,
    },
    {
        code: 'ASSET_MANAGER',
        label: 'Asset Manager',
        description: 'Manages the asset register, approves new assets, requests disposals.',
        isSystem: true,
        permissions: ASSET_MANAGER_PERMS,
    },
    {
        code: 'FINANCE_OFFICER',
        label: 'Finance Officer',
        description: 'Runs depreciation and revaluations, gives final sign-off on disposals.',
        isSystem: true,
        permissions: FINANCE_OFFICER_PERMS,
    },
    {
        code: 'FIELD_OFFICER',
        label: 'Field Officer',
        description: 'Registers and verifies assets in the field, logs maintenance.',
        isSystem: true,
        permissions: FIELD_OFFICER_PERMS,
    },
    {
        code: 'AUDITOR',
        label: 'Auditor',
        description: 'Read-only oversight — including the audit trail.',
        isSystem: true,
        permissions: AUDITOR_PERMS,
    },
    {
        code: 'PUBLIC_USER',
        label: 'Public User',
        description: 'Citizen-facing read-only access to assets and the GIS map.',
        isSystem: true,
        permissions: PUBLIC_USER_PERMS,
    },
];

/* ============================================================
   DEFAULTS
   ============================================================ */

/*
  Role assigned when a self-registration is approved without an
  explicit selection. Matches the MD: "There is no seeded
  PUBLIC_USER account — that role exists for a future
  citizen-facing portal login."
*/
export const DEFAULT_ROLE_CODE = 'PUBLIC_USER';

/* ============================================================
   HELPERS
   ============================================================ */

/* Look up a permission's display label */
export const getPermissionLabel = (code) =>
    PERMISSIONS.find((p) => p.code === code)?.label ?? code;

/*
  Group permissions into ordered buckets for display.
  Returns: [{ group: 'Assets', items: [{code,label}, ...] }, ...]
*/
export const getPermissionsByGroup = () => {
    const byGroup = new Map();
    for (const p of PERMISSIONS) {
        if (!byGroup.has(p.group)) byGroup.set(p.group, []);
        byGroup.get(p.group).push({ code: p.code, label: p.label });
    }
    return PERMISSION_GROUPS
        .filter((g) => byGroup.has(g))
        .map((g) => ({ group: g, items: byGroup.get(g) }));
};

/*
  Sanitize an incoming permission array — drop anything that
  isn't a known code, and remove duplicates.
*/
export const sanitizePermissions = (arr) => {
    if (!Array.isArray(arr)) return [];
    const known = new Set(ALL_PERMISSION_CODES);
    return [...new Set(arr.filter((c) => known.has(c)))];
};

/*
  Generate a role code from a display name.
  "Regional Officer" → "REGIONAL_OFFICER"
*/
export const generateRoleCode = (label) =>
    String(label || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');