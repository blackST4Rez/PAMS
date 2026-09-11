// src/mock/mockData.js
// 🔧 When your backend is ready, set VITE_USE_MOCK=false in .env
//    and delete this file.

export const MOCK_USERS = {
    // username: { password, user }
    'prem.thapa': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-001',
            username: 'prem.thapa',
            fullName: 'Prem Thapa',
            designation: 'System Administrator',
            roles: ['SYS_ADMIN'],
            permissions: [
                // System Admin has everything
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

    'sita.devkota': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-002',
            username: 'sita.devkota',
            fullName: 'Sita Devkota',
            designation: 'Asset Manager',
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

    'narayan.kafle': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-003',
            username: 'narayan.kafle',
            fullName: 'Narayan Kafle',
            designation: 'Finance Officer',
            roles: ['FINANCE_OFFICER'],
            permissions: [
                'asset.view',
                'valuation.view', 'valuation.edit',
                'report.view', 'report.export',
            ],
        },
    },

    'ram.basnet': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-004',
            username: 'ram.basnet',
            fullName: 'Ram Basnet',
            designation: 'Field Officer',
            roles: ['FIELD_OFFICER'],
            permissions: [
                'asset.view', 'asset.create', 'asset.edit',
                'gis.view',
                'maintenance.view', 'maintenance.create',
                'verification.verify',
            ],
        },
    },

    'saraswoti.l': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-005',
            username: 'saraswoti.l',
            fullName: 'Saraswoti Lama',
            designation: 'Auditor',
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

    'public.user': {
        password: 'ChangeMe123!',
        user: {
            id: 'u-006',
            username: 'public.user',
            fullName: 'Public Visitor',
            designation: 'Citizen',
            roles: ['PUBLIC_USER'],
            permissions: ['asset.view', 'gis.view'],
        },
    },
};

// Mock menu per role — when backend is ready this comes from /menus/me
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
        { label: 'Roles', path: '/roles', icon: 'FaShieldAlt' },
        { label: 'System Config', path: '/config', icon: 'FaCog' },
    ],
    ASSET_MANAGER: [
        { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
        { label: 'All Assets', path: '/assets', icon: 'FaBox' },
        { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
        { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
        { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
        { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
        { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
        { label: 'My Approvals', path: '/approvals', icon: 'FaShieldAlt' },
    ],
    FINANCE_OFFICER: [
        { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
        { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
        { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
        { label: 'My Approvals', path: '/approvals', icon: 'FaShieldAlt' },
    ],
    FIELD_OFFICER: [
        { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
        { label: 'Register Asset', path: '/assets/new', icon: 'FaPlus' },
        { label: 'Maintenance', path: '/maintenance', icon: 'FaWrench' },
        { label: 'Field Verify', path: '/verify', icon: 'FaClipboardCheck' },
        { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    ],
    AUDITOR: [
        { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
        { label: 'All Assets', path: '/assets', icon: 'FaBox' },
        { label: 'Valuation', path: '/valuation', icon: 'FaChartLine' },
        { label: 'Reports', path: '/reports', icon: 'FaFileAlt' },
        { label: 'Audit Trail', path: '/audit', icon: 'FaHistory' },
    ],
    PUBLIC_USER: [
        { label: 'Overview', path: '/dashboard', icon: 'FaTachometerAlt' },
        { label: 'GIS Map', path: '/gis', icon: 'FaMapMarkedAlt' },
    ],
};

// Mock approvals queue per role — when backend ready, comes from /approvals/pending
export const MOCK_PENDING_APPROVALS = {
    ASSET_MANAGER: [
        {
            requestId: 'req-001',
            entityName: 'asset_disposal',
            entityId: 'asset-101',
            title: 'Disposal: Old School Bus #3',
            currentLevel: 1,
            totalLevels: 2,
            status: 'Pending',
            createdAt: '2026-07-28T10:00:00Z',
        },
    ],
    FINANCE_OFFICER: [
        {
            requestId: 'req-002',
            entityName: 'asset_disposal',
            entityId: 'asset-102',
            title: 'Disposal: Fire Truck #1 (Level 2, your approval)',
            currentLevel: 2,
            totalLevels: 2,
            status: 'InReview',
            createdAt: '2026-07-27T09:00:00Z',
        },
    ],
    SYS_ADMIN: [
        {
            requestId: 'req-001',
            entityName: 'asset_disposal',
            entityId: 'asset-101',
            title: 'Disposal: Old School Bus #3',
            currentLevel: 1,
            totalLevels: 2,
            status: 'Pending',
            createdAt: '2026-07-28T10:00:00Z',
        },
        {
            requestId: 'req-002',
            entityName: 'asset_disposal',
            entityId: 'asset-102',
            title: 'Disposal: Fire Truck #1',
            currentLevel: 2,
            totalLevels: 2,
            status: 'InReview',
            createdAt: '2026-07-27T09:00:00Z',
        },
    ],
    FIELD_OFFICER: [],
    AUDITOR: [],
    PUBLIC_USER: [],
};

// Mock notifications
export const MOCK_NOTIFICATIONS = {
    'sita.devkota': [
        { id: 'n1', title: 'Asset approved', body: 'Your asset "Ward 3 Community Hall" was approved.', read: false, createdAt: '2026-07-28T11:00:00Z' },
    ],
    'narayan.kafle': [
        { id: 'n2', title: 'Disposal awaiting your approval', body: 'Fire Truck #1 needs level 2 sign-off.', read: false, createdAt: '2026-07-27T09:05:00Z' },
    ],
};