// src/mock/mockData.js
// Auth + profile + notification + login history mock data — no backend required.

/* ============================================================
   MENUS — every role ends with "My Profile"
   ============================================================ */
export const MOCK_MENUS = {
  SYS_ADMIN: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Users', path: '/users', icon: 'FaUsers' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaHistory' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'Roles', path: '/roles', icon: 'FaUserTag' },
    { label: 'System Config', path: '/config', icon: 'FaCog' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  ASSET_MANAGER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  FINANCE_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  FIELD_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  AUDITOR: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaAnchor' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaHistory' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  PUBLIC_USER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],
};

/* ============================================================
   PENDING APPROVALS — keyed by role
   ============================================================ */
export const MOCK_PENDING_APPROVALS = {
  ASSET_MANAGER: [],
  FINANCE_OFFICER: [],
  SYS_ADMIN: [],
  FIELD_OFFICER: [],
  AUDITOR: [],
  PUBLIC_USER: [],
};

/* ============================================================
   NOTIFICATIONS — keyed by username
   ============================================================ */
export const MOCK_USER_NOTIFICATIONS = {};

/* ============================================================
   LOGIN HISTORY — keyed by username
   ============================================================ */
export const MOCK_LOGIN_HISTORY = {};