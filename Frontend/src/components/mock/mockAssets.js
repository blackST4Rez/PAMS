// src/mock/mockAssets.js
//
// Asset Registry seed data + helpers.
//
// Separate from dashboardData.js (which serves the cosmetic widgets).
// This file is the registry's domain — real assets with the shape the
// asset pages, forms, and lifecycle timeline consume.

/* ============================================================
   ORGANIZATION — municipality + wards
   ============================================================ */
export const MOCK_MUNICIPALITY = {
    id: 'mun-01',
    name: 'Gaurishankar Rural Municipality',
    district: 'Dolakha',
    province: 'Bagmati',
};

export const MOCK_WARDS = [
    { id: 'w-1', name: 'Ward 1' },
    { id: 'w-2', name: 'Ward 2' },
    { id: 'w-3', name: 'Ward 3' },
    { id: 'w-4', name: 'Ward 4' },
    { id: 'w-5', name: 'Ward 5' },
    { id: 'w-6', name: 'Ward 6' },
    { id: 'w-7', name: 'Ward 7' },
    { id: 'w-8', name: 'Ward 8' },
    { id: 'w-9', name: 'Ward 9' },
];

/* ============================================================
   CATEGORIES — with default depreciation rules
   ============================================================ */
export const MOCK_ASSET_CATEGORIES = [
    {
        id: 'cat-land',
        code: 'LND',
        name: 'Land',
        defaultDepreciationMethod: 'NONE',
        usefulLifeYears: null,
    },
    {
        id: 'cat-building',
        code: 'BLD',
        name: 'Building',
        defaultDepreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 50,
    },
    {
        id: 'cat-road',
        code: 'RD',
        name: 'Road',
        defaultDepreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 20,
    },
    {
        id: 'cat-vehicle',
        code: 'VEH',
        name: 'Vehicle',
        defaultDepreciationMethod: 'DECLINING_BALANCE',
        usefulLifeYears: 10,
    },
    {
        id: 'cat-infrastructure',
        code: 'INF',
        name: 'Infrastructure',
        defaultDepreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 25,
    },
    {
        id: 'cat-equipment',
        code: 'EQP',
        name: 'Office Equipment',
        defaultDepreciationMethod: 'DECLINING_BALANCE',
        usefulLifeYears: 5,
    },
];

export const DEPRECIATION_METHODS = [
    { code: 'NONE', label: 'None (non-depreciable)' },
    { code: 'STRAIGHT_LINE', label: 'Straight Line' },
    { code: 'DECLINING_BALANCE', label: 'Declining Balance' },
];

export const ASSET_STATUSES = [
    { code: 'AWAITING_REVIEW', label: 'Awaiting Review', color: 'text-yellow-300' },
    { code: 'ACTIVE', label: 'Active', color: 'text-green-300' },
    { code: 'MAINTENANCE', label: 'Maintenance', color: 'text-orange-300' },
    { code: 'RETIRED', label: 'Retired', color: 'text-gray-300' },
    { code: 'CANCELLED', label: 'Cancelled', color: 'text-red-300' },
];

/* ============================================================
   SEED ASSETS — a mix of statuses so every UI path has data
   ============================================================ */
export const MOCK_ASSETS = [
    {
        id: 'a-001',
        assetCode: 'GAU-BLD-0001',
        title: 'Town Hall Building',
        description: 'Main administrative building of the rural municipality.',
        categoryId: 'cat-building',
        wardId: 'w-3',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-01-15',
        acquisitionCost: 24000000,
        currentBookValue: 22800000,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 50,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-01-15T09:00:00Z',
        deletedAt: null,
    },
    {
        id: 'a-002',
        assetCode: 'GAU-VEH-0001',
        title: 'Fire Truck #1',
        description: 'Primary fire response vehicle for the municipality.',
        categoryId: 'cat-vehicle',
        wardId: 'w-2',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-03-20',
        acquisitionCost: 850000,
        currentBookValue: 620000,
        depreciationMethod: 'DECLINING_BALANCE',
        usefulLifeYears: 10,
        status: 'MAINTENANCE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-03-20T10:30:00Z',
        deletedAt: null,
    },
    {
        id: 'a-003',
        assetCode: 'GAU-INF-0001',
        title: 'Water Treatment Plant',
        description: 'Community water treatment facility serving Ward 7.',
        categoryId: 'cat-infrastructure',
        wardId: 'w-7',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-05-10',
        acquisitionCost: 12000000,
        currentBookValue: 11400000,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 25,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-05-10T11:15:00Z',
        deletedAt: null,
    },
    {
        id: 'a-004',
        assetCode: 'GAU-BLD-0002',
        title: 'Community Center',
        description: 'Multi-purpose community hall used for public gatherings.',
        categoryId: 'cat-building',
        wardId: 'w-3',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-07-01',
        acquisitionCost: 18000000,
        currentBookValue: 17460000,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 50,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-07-01T08:45:00Z',
        deletedAt: null,
    },
    {
        id: 'a-005',
        assetCode: 'GAU-VEH-0002',
        title: 'School Bus #3',
        description: 'Decommissioned school transport vehicle.',
        categoryId: 'cat-vehicle',
        wardId: 'w-1',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-09-15',
        acquisitionCost: 120000,
        currentBookValue: 0,
        depreciationMethod: 'DECLINING_BALANCE',
        usefulLifeYears: 10,
        status: 'RETIRED',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-09-15T14:20:00Z',
        deletedAt: null,
    },
    {
        id: 'a-006',
        assetCode: 'GAU-RD-0001',
        title: 'Ward 1 Road Section',
        description: 'Paved road segment connecting Ward 1 to the highway.',
        categoryId: 'cat-road',
        wardId: 'w-1',
        municipalityId: 'mun-01',
        acquisitionDate: '2080-11-02',
        acquisitionCost: 850000,
        currentBookValue: 807500,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 20,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2080-11-02T10:00:00Z',
        deletedAt: null,
    },
    {
        id: 'a-007',
        assetCode: 'GAU-LND-0001',
        title: 'Ward 5 Public Park Land',
        description: 'Public park land parcel in Ward 5.',
        categoryId: 'cat-land',
        wardId: 'w-5',
        municipalityId: 'mun-01',
        acquisitionDate: '2081-01-20',
        acquisitionCost: 24000000,
        currentBookValue: 24000000,
        depreciationMethod: 'NONE',
        usefulLifeYears: null,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2081-01-20T09:30:00Z',
        deletedAt: null,
    },
    {
        id: 'a-008',
        assetCode: 'GAU-INF-0002',
        title: 'Ward 7 Water Pump',
        description: 'Community water pump servicing Ward 7 households.',
        categoryId: 'cat-infrastructure',
        wardId: 'w-7',
        municipalityId: 'mun-01',
        acquisitionDate: '2081-02-11',
        acquisitionCost: 180000,
        currentBookValue: 174600,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 25,
        status: 'ACTIVE',
        createdBy: 'admin.gaurishankar',
        createdAt: '2081-02-11T13:00:00Z',
        deletedAt: null,
    },
    {
        id: 'a-009',
        assetCode: 'GAU-EQP-0001',
        title: 'New Office Printer',
        description: 'HP LaserJet Pro purchased for the records department.',
        categoryId: 'cat-equipment',
        wardId: 'w-3',
        municipalityId: 'mun-01',
        acquisitionDate: '2081-02-25',
        acquisitionCost: 85000,
        currentBookValue: 85000,
        depreciationMethod: 'DECLINING_BALANCE',
        usefulLifeYears: 5,
        status: 'AWAITING_REVIEW',
        createdBy: 'admin.gaurishankar',
        createdAt: '2081-02-25T11:00:00Z',
        deletedAt: null,
    },
    {
        id: 'a-010',
        assetCode: 'GAU-BLD-0003',
        title: 'Ward 4 Health Post',
        description: 'Newly constructed health post awaiting verification.',
        categoryId: 'cat-building',
        wardId: 'w-4',
        municipalityId: 'mun-01',
        acquisitionDate: '2081-03-05',
        acquisitionCost: 6200000,
        currentBookValue: 6200000,
        depreciationMethod: 'STRAIGHT_LINE',
        usefulLifeYears: 50,
        status: 'AWAITING_REVIEW',
        createdBy: 'admin.gaurishankar',
        createdAt: '2081-03-05T15:30:00Z',
        deletedAt: null,
    },
];

/* ============================================================
   LIFECYCLE — one entry per notable action on an asset
   Shape: { id, assetId, type, at, by, note }
   Types: CREATED | UPDATED | APPROVED | REJECTED | DELETED
   ============================================================ */
export const MOCK_ASSET_LIFECYCLE = [
    { id: 'lc-001', assetId: 'a-001', type: 'CREATED', at: '2080-01-15T09:00:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-002', assetId: 'a-001', type: 'APPROVED', at: '2080-01-16T10:30:00Z', by: 'admin.gaurishankar', note: 'Verified against deed' },

    { id: 'lc-003', assetId: 'a-002', type: 'CREATED', at: '2080-03-20T10:30:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-004', assetId: 'a-002', type: 'APPROVED', at: '2080-03-22T09:15:00Z', by: 'admin.gaurishankar', note: 'Purchase verified' },
    { id: 'lc-005', assetId: 'a-002', type: 'UPDATED', at: '2081-01-10T11:00:00Z', by: 'admin.gaurishankar', note: 'Marked for maintenance' },

    { id: 'lc-006', assetId: 'a-003', type: 'CREATED', at: '2080-05-10T11:15:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-007', assetId: 'a-003', type: 'APPROVED', at: '2080-05-12T14:00:00Z', by: 'admin.gaurishankar', note: 'Approved' },

    { id: 'lc-008', assetId: 'a-004', type: 'CREATED', at: '2080-07-01T08:45:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-009', assetId: 'a-004', type: 'APPROVED', at: '2080-07-03T09:30:00Z', by: 'admin.gaurishankar', note: 'Approved' },

    { id: 'lc-010', assetId: 'a-005', type: 'CREATED', at: '2080-09-15T14:20:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-011', assetId: 'a-005', type: 'APPROVED', at: '2080-09-16T10:00:00Z', by: 'admin.gaurishankar', note: 'Approved' },
    { id: 'lc-012', assetId: 'a-005', type: 'UPDATED', at: '2081-02-01T12:00:00Z', by: 'admin.gaurishankar', note: 'Retired after decommissioning' },

    { id: 'lc-013', assetId: 'a-006', type: 'CREATED', at: '2080-11-02T10:00:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-014', assetId: 'a-006', type: 'APPROVED', at: '2080-11-04T11:45:00Z', by: 'admin.gaurishankar', note: 'Approved' },

    { id: 'lc-015', assetId: 'a-007', type: 'CREATED', at: '2081-01-20T09:30:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-016', assetId: 'a-007', type: 'APPROVED', at: '2081-01-22T10:15:00Z', by: 'admin.gaurishankar', note: 'Land records verified' },

    { id: 'lc-017', assetId: 'a-008', type: 'CREATED', at: '2081-02-11T13:00:00Z', by: 'admin.gaurishankar', note: 'Registered' },
    { id: 'lc-018', assetId: 'a-008', type: 'APPROVED', at: '2081-02-13T09:00:00Z', by: 'admin.gaurishankar', note: 'Approved' },

    { id: 'lc-019', assetId: 'a-009', type: 'CREATED', at: '2081-02-25T11:00:00Z', by: 'admin.gaurishankar', note: 'Submitted for review' },

    { id: 'lc-020', assetId: 'a-010', type: 'CREATED', at: '2081-03-05T15:30:00Z', by: 'admin.gaurishankar', note: 'Submitted for review' },
];

/* ============================================================
   HELPERS
   ============================================================ */

/*
  Generate the next asset code for a category.
  Format: GAU-<CATEGORY_CODE>-<4-digit sequence>
*/
export const generateAssetCode = (categoryCode, existingAssets = []) => {
    const prefix = `GAU-${categoryCode}-`;
    let maxSeq = 0;

    for (const a of existingAssets) {
        if (typeof a?.assetCode === 'string' && a.assetCode.startsWith(prefix)) {
            const tail = a.assetCode.slice(prefix.length);
            const n = parseInt(tail, 10);
            if (Number.isFinite(n) && n > maxSeq) maxSeq = n;
        }
    }

    const next = String(maxSeq + 1).padStart(4, '0');
    return `${prefix}${next}`;
};

/*
  Look up a category by id — returns the full object or null.
*/
export const getCategoryById = (id) =>
    MOCK_ASSET_CATEGORIES.find((c) => c.id === id) ?? null;

/*
  Look up a ward by id.
*/
export const getWardById = (id) =>
    MOCK_WARDS.find((w) => w.id === id) ?? null;

/*
  Look up an asset status definition by code — returns label + color,
  or a neutral fallback for unknown codes.
*/
export const getStatusMeta = (code) =>
    ASSET_STATUSES.find((s) => s.code === code) ?? {
        code,
        label: code,
        color: 'text-white/70',
    };