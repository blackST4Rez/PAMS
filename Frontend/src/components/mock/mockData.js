// src/mock/mockData.js
// Auth + menu schema. Nothing user-specific — all user data lives in
// localStorage, written by real actions.

/* ============================================================
   MENUS — profile is accessed from the header dropdown instead
   ============================================================ */
export const MOCK_MENUS = {
  SYS_ADMIN: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'Users', path: '/users', icon: 'FaUsers' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Valuation', path: '/valuation', icon: 'FaDollarSign' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaFeatherAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'Roles', path: '/roles', icon: 'FaUserTag' },
    { label: 'System Config', path: '/config', icon: 'FaCog' },
  ],

  ASSET_MANAGER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
  ],

  FINANCE_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'Valuation', path: '/valuation', icon: 'FaDollarSign' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
  ],

  FIELD_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
  ],

  AUDITOR: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Valuation', path: '/valuation', icon: 'FaDollarSign' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaFeatherAlt' },
  ],

  PUBLIC_USER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaQuestionCircle' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
  ],
};