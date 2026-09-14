// src/mock/mockData.js
// Auth + profile + notification + login history mock data — no backend required.

/* ============================================================
   USERS — lookup table keyed by username (username itself lives on the login form)
   ============================================================ */
export const MOCK_USERS = {
  /* SYS_ADMIN — Sita Thapa */
  'sita.thapa': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-001',
      fullName: 'Sita Thapa',
      designation: 'System Administrator',
      email: 'sita.thapa@gaurishankar.gov.np',
      phone: '+977-9841000001',
      avatar:
        'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=986&auto=format&fit=crop',
      roles: ['SYS_ADMIN'],
      permissions: [
        'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
        'asset.approve', 'asset.transfer', 'gis.view',
        'maintenance.view', 'maintenance.create',
        'valuation.view', 'valuation.edit',
        'verification.verify',
        'disposal.create', 'disposal.approve',
        'report.view', 'report.export',
        'audit.view',
        'admin.users', 'admin.roles', 'admin.config',
      ],
    },
  },

  /* ASSET_MANAGER — Sita Devkota */
  'sita.devkota': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-002',
      fullName: 'Sita Devkota',
      designation: 'Asset Manager',
      email: 'sita.devkota@gaurishankar.gov.np',
      phone: '+977-9841000002',
      avatar:
        'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?q=80&w=987&auto=format&fit=crop',
      roles: ['ASSET_MANAGER'],
      permissions: [
        'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
        'asset.approve', 'asset.transfer', 'gis.view',
        'maintenance.view', 'maintenance.create',
        'verification.verify',
        'disposal.create',
        'report.view', 'report.export',
      ],
    },
  },

  /* FINANCE_OFFICER — Narayan Kafle */
  'narayan.kafle': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-003',
      fullName: 'Narayan Kafle',
      designation: 'Finance Officer',
      email: 'narayan.kafle@gaurishankar.gov.np',
      phone: '+977-9841000003',
      avatar:
        'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=1066&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      roles: ['FINANCE_OFFICER'],
      permissions: [
        'asset.view',
        'valuation.view', 'valuation.edit',
        'report.view', 'report.export',
      ],
    },
  },

  /* FIELD_OFFICER — Ram Basnet */
  'ram.basnet': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-004',
      fullName: 'Ram Basnet',
      designation: 'Field Officer',
      email: 'ram.basnet@gaurishankar.gov.np',
      phone: '+977-9841000004',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1180&auto=format&fit=crop',
      roles: ['FIELD_OFFICER'],
      permissions: [
        'asset.view', 'asset.create', 'asset.edit',
        'gis.view',
        'maintenance.view', 'maintenance.create',
        'verification.verify',
      ],
    },
  },

  /* AUDITOR — Saraswoti Lama */
  'saraswoti.l': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-005',
      fullName: 'Saraswoti Lama',
      designation: 'Auditor',
      email: 'saraswoti.lama@gaurishankar.gov.np',
      phone: '+977-9841000005',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop',
      roles: ['AUDITOR'],
      permissions: [
        'asset.view', 'gis.view',
        'maintenance.view',
        'valuation.view',
        'report.view', 'report.export',
        'audit.view',
      ],
    },
  },

  /* PUBLIC_USER — Public Visitor */
  'public.user': {
    password: 'ChangeMe123!',
    user: {
      id: 'u-006',
      fullName: 'Public Visitor',
      designation: 'Citizen',
      email: 'visitor@example.com',
      phone: '',
      avatar:
        'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1621&auto=format&fit=crop',
      roles: ['PUBLIC_USER'],
      permissions: ['asset.view', 'gis.view'],
    },
  },
};

/* ============================================================
   MENUS — every role ends with "My Profile"
   ============================================================ */
export const MOCK_MENUS = {
  /* System Administrator — full access */
  SYS_ADMIN: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Users', path: '/users', icon: 'FaUsers' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaHistory' },
    { label: 'Roles', path: '/roles', icon: 'FaShieldAlt' },
    { label: 'System Config', path: '/config', icon: 'FaCog' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  /* Asset Manager — asset operations + approvals */
  ASSET_MANAGER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaShieldAlt' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  /* Finance Officer — valuation + reports + approvals */
  FINANCE_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'My Approvals', path: '/approvals', icon: 'FaShieldAlt' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  /* Field Officer — data entry + field work */
  FIELD_OFFICER: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
    { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
    { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
    { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  /* Auditor — read-only oversight */
  AUDITOR: [
    { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
    { label: 'All Assets', path: '/assets', icon: 'FaBox' },
    { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
    { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
    { label: 'Audit Trail', path: '/audit', icon: 'FaHistory' },
    { label: 'My Profile', path: '/profile', icon: 'FaUserCircle' },
  ],

  /* Public User — citizen portal */
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
  /* Asset Manager — owns level 1 of the disposal chain */
  ASSET_MANAGER: [
    {
      requestId: 'req-001',
      entityName: 'asset_disposal',
      entityId: 'asset-101',
      title: 'Disposal: Old School Bus #3',
      currentLevel: 1,
      totalLevels: 2,
      status: 'Pending',
      createdAt: '2081-01-15T10:00:00Z',
    },
  ],

  /* Finance Officer — owns level 2 (final) of the disposal chain */
  FINANCE_OFFICER: [
    {
      requestId: 'req-002',
      entityName: 'asset_disposal',
      entityId: 'asset-102',
      title: 'Disposal: Fire Truck #1 (Level 2, your approval)',
      currentLevel: 2,
      totalLevels: 2,
      status: 'InReview',
      createdAt: '2081-01-14T09:00:00Z',
    },
  ],

  /* System Admin — oversight: sees everything */
  SYS_ADMIN: [
    {
      requestId: 'req-001',
      entityName: 'asset_disposal',
      entityId: 'asset-101',
      title: 'Disposal: Old School Bus #3',
      currentLevel: 1,
      totalLevels: 2,
      status: 'Pending',
      createdAt: '2081-01-15T10:00:00Z',
    },
    {
      requestId: 'req-002',
      entityName: 'asset_disposal',
      entityId: 'asset-102',
      title: 'Disposal: Fire Truck #1',
      currentLevel: 2,
      totalLevels: 2,
      status: 'InReview',
      createdAt: '2081-01-14T09:00:00Z',
    },
  ],

  /* No approvals pending for these roles */
  FIELD_OFFICER: [],
  AUDITOR: [],
  PUBLIC_USER: [],
};

/* ============================================================
   NOTIFICATIONS — keyed by username
   ============================================================ */
export const MOCK_USER_NOTIFICATIONS = {
  'sita.thapa': [
    { id: 'n-101', title: 'New user registered', body: 'Emily Davis requested access.', read: false, createdAt: '2081-01-15T09:12:00Z' },
    { id: 'n-102', title: 'System backup completed', body: 'Daily backup finished successfully.', read: true, createdAt: '2081-01-15T03:00:00Z' },
    { id: 'n-103', title: 'Integration failed', body: 'Land-records API timed out at 02:14.', read: false, createdAt: '2081-01-14T02:14:00Z' },
    { id: 'n-104', title: 'Role permissions updated', body: 'Asset Manager permissions changed.', read: true, createdAt: '2081-01-13T16:45:00Z' },
  ],
  'sita.devkota': [
    { id: 'n-201', title: 'Asset approved', body: 'Your asset "Ward 3 Community Hall" was approved.', read: false, createdAt: '2081-01-15T11:00:00Z' },
    { id: 'n-202', title: 'Disposal request pending', body: 'Old School Bus #3 awaits your level-1 approval.', read: false, createdAt: '2081-01-15T10:05:00Z' },
    { id: 'n-203', title: 'Maintenance due', body: 'Fire Truck #1 maintenance overdue by 3 days.', read: true, createdAt: '2081-01-14T08:30:00Z' },
  ],
  'narayan.kafle': [
    { id: 'n-301', title: 'Disposal awaiting approval', body: 'Fire Truck #1 needs your level-2 sign-off.', read: false, createdAt: '2081-01-15T09:30:00Z' },
    { id: 'n-302', title: 'FY 2081/82 budget published', body: 'Annual budget report is now available.', read: true, createdAt: '2081-01-12T14:00:00Z' },
  ],
  'ram.basnet': [
    { id: 'n-401', title: 'New task assigned', body: 'Building Inspection at Town Hall due 2081-01-20.', read: false, createdAt: '2081-01-15T08:00:00Z' },
    { id: 'n-402', title: 'Asset verification due', body: 'Water Plant asset verification pending.', read: true, createdAt: '2081-01-13T10:15:00Z' },
  ],
  'saraswoti.l': [
    { id: 'n-501', title: 'Flagged item detected', body: 'Missing documentation on 12 assets.', read: false, createdAt: '2081-01-15T07:45:00Z' },
    { id: 'n-502', title: 'Q1 audit report ready', body: 'Q1 compliance report has been generated.', read: true, createdAt: '2081-01-10T12:00:00Z' },
  ],
  'public.user': [
    { id: 'n-601', title: 'Welcome to PMS', body: 'Browse public assets and the GIS map.', read: false, createdAt: '2081-01-01T00:00:00Z' },
  ],
};

/* ============================================================
   LOGIN HISTORY — keyed by username
   ============================================================ */
export const MOCK_LOGIN_HISTORY = {
  /* Sita Thapa — includes one failed attempt from an unknown IP */
  'sita.thapa': [
    { id: 'lh-101', ip: '192.168.1.10', device: 'Chrome · Windows', location: 'Kathmandu, NP', loginAt: '2081-01-15T08:55:00Z', successful: true },
    { id: 'lh-102', ip: '192.168.1.10', device: 'Chrome · Windows', location: 'Kathmandu, NP', loginAt: '2081-01-14T09:12:00Z', successful: true },
    { id: 'lh-103', ip: '203.0.113.44', device: 'Unknown', location: 'Unknown', loginAt: '2081-01-13T23:47:00Z', successful: false },
    { id: 'lh-104', ip: '192.168.1.10', device: 'Chrome · Windows', location: 'Kathmandu, NP', loginAt: '2081-01-13T09:05:00Z', successful: true },
    { id: 'lh-105', ip: '192.168.1.10', device: 'Safari · iPhone', location: 'Kathmandu, NP', loginAt: '2081-01-12T19:22:00Z', successful: true },
  ],

  'sita.devkota': [
    { id: 'lh-201', ip: '192.168.1.22', device: 'Chrome · Windows', location: 'Charikot, NP', loginAt: '2081-01-15T08:30:00Z', successful: true },
    { id: 'lh-202', ip: '192.168.1.22', device: 'Chrome · Windows', location: 'Charikot, NP', loginAt: '2081-01-14T08:45:00Z', successful: true },
    { id: 'lh-203', ip: '192.168.1.22', device: 'Chrome · Windows', location: 'Charikot, NP', loginAt: '2081-01-13T09:00:00Z', successful: true },
  ],

  'narayan.kafle': [
    { id: 'lh-301', ip: '192.168.1.31', device: 'Firefox · Linux', location: 'Charikot, NP', loginAt: '2081-01-15T09:00:00Z', successful: true },
    { id: 'lh-302', ip: '192.168.1.31', device: 'Firefox · Linux', location: 'Charikot, NP', loginAt: '2081-01-14T09:15:00Z', successful: true },
  ],

  'ram.basnet': [
    { id: 'lh-401', ip: '192.168.1.45', device: 'Chrome · Android', location: 'Dolakha, NP', loginAt: '2081-01-15T07:50:00Z', successful: true },
    { id: 'lh-402', ip: '192.168.1.45', device: 'Chrome · Android', location: 'Dolakha, NP', loginAt: '2081-01-14T07:55:00Z', successful: true },
    { id: 'lh-403', ip: '192.168.1.45', device: 'Chrome · Android', location: 'Dolakha, NP', loginAt: '2081-01-13T08:05:00Z', successful: true },
  ],

  'saraswoti.l': [
    { id: 'lh-501', ip: '192.168.1.52', device: 'Chrome · macOS', location: 'Kathmandu, NP', loginAt: '2081-01-15T09:20:00Z', successful: true },
    { id: 'lh-502', ip: '192.168.1.52', device: 'Chrome · macOS', location: 'Kathmandu, NP', loginAt: '2081-01-14T09:25:00Z', successful: true },
  ],

  'public.user': [
    { id: 'lh-601', ip: '203.0.113.99', device: 'Chrome · Windows', location: 'Kathmandu, NP', loginAt: '2081-01-15T10:00:00Z', successful: true },
  ],
};