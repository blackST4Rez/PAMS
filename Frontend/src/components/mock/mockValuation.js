// src/mock/mockValuation.js
//
// Valuation & Depreciation data layer.
//
// Provides:
//   • The depreciation math for each method (straight-line, declining-
//     balance, none)
//   • Helpers to compute one year's depreciation and the new book value
//   • Fiscal-year label helper (BS-style)
//   • Seed history for past depreciation runs and revaluations
//
// Rules (from the MD):
//   • Land never depreciates (method = 'NONE')
//   • Depreciation method is set per asset from its category default
//   • Book value never goes below zero

/* ============================================================
   FISCAL-YEAR HELPERS
   Nepal's fiscal year runs Shrawan → Asar. We use a simple AD-based
   approximation: FY starts on Shrawan 1 (roughly July 16 of the
   starting year) and ends Asar end (roughly July 15 of the next year).
   ============================================================ */

/*
  Which fiscal year does this date belong to?
  Returns a label like "FY 2081/82" — using BS year numbers.
  Approximation: BS year ≈ AD year + 56. FY starts in mid-July.
*/
export const fiscalYearOf = (date = new Date()) => {
    const d = new Date(date);
    const adYear = d.getFullYear();
    const bsYear = adYear + 56;

    // Before July 16 (month index 6, day 16) → still previous FY
    const beforeFYStart = d.getMonth() < 6 || (d.getMonth() === 6 && d.getDate() < 16);

    const fyStart = beforeFYStart ? bsYear - 1 : bsYear;
    return {
        startBsYear: fyStart,
        label: `FY ${fyStart}/${String(fyStart + 1).slice(-2)}`,
    };
};

/* Convenience: current FY label */
export const currentFYLabel = () => fiscalYearOf().label;

/* ============================================================
   DEPRECIATION MATH
   Every function takes an asset-shaped object and returns a number.
   No side-effects, no persistence — pure math.
   ============================================================ */

/*
  Annual depreciation amount for one year, given the asset's method.

  STRAIGHT_LINE:
    annual = acquisitionCost / usefulLifeYears
    (assumes zero salvage value — the MD doesn't mention salvage)

  DECLINING_BALANCE:
    rate = 2 / usefulLifeYears          (double-declining)
    annual = currentBookValue × rate

  NONE:
    annual = 0

  Never returns a number that would push book value below zero;
  callers should clamp with the `applyDepreciation` helper below.
*/
export const annualDepreciation = (asset) => {
    const cost = Number(asset.acquisitionCost) || 0;
    const book = Number(asset.currentBookValue) || 0;
    const life = Number(asset.usefulLifeYears) || 0;

    switch (asset.depreciationMethod) {
        case 'STRAIGHT_LINE': {
            if (life <= 0) return 0;
            return cost / life;
        }
        case 'DECLINING_BALANCE': {
            if (life <= 0) return 0;
            const rate = 2 / life;
            return book * rate;
        }
        case 'NONE':
        default:
            return 0;
    }
};

/*
  Compute the new book value after one year of depreciation.
  Clamped at zero. Returns { amount, nextBookValue }.
*/
export const applyOneYear = (asset) => {
    const book = Number(asset.currentBookValue) || 0;
    const amount = annualDepreciation(asset);
    const raw = book - amount;
    const nextBookValue = Math.max(0, raw);

    return {
        amount: book - nextBookValue, // actual amount that got subtracted (may be less than 'amount' due to clamp)
        nextBookValue,
    };
};

/*
  How many more years of depreciation does this asset have?
  Returns Infinity for NONE-method assets (they never depreciate out).
*/
export const yearsRemaining = (asset) => {
    if (asset.depreciationMethod === 'NONE') return Infinity;
    const life = Number(asset.usefulLifeYears) || 0;
    if (life <= 0) return 0;
    if (asset.depreciationMethod === 'STRAIGHT_LINE') {
        const perYear = (Number(asset.acquisitionCost) || 0) / life;
        if (perYear <= 0) return 0;
        return Math.ceil((Number(asset.currentBookValue) || 0) / perYear);
    }
    /* Declining balance never fully reaches zero mathematically,
       but we can report "years until value falls below 1% of cost" */
    const book = Number(asset.currentBookValue) || 0;
    const cost = Number(asset.acquisitionCost) || 0;
    if (book <= 0 || cost <= 0) return 0;
    const rate = 2 / life;
    return Math.ceil(Math.log(0.01 * cost / book) / Math.log(1 - rate));
};

/*
  Human label for a depreciation method.
*/
export const methodLabel = (code) =>
({
    NONE: 'None (non-depreciable)',
    STRAIGHT_LINE: 'Straight Line',
    DECLINING_BALANCE: 'Declining Balance',
}[code] ?? code);

/*
  Is this asset eligible for depreciation?
  Ineligible: land (NONE), anything already retired, anything fully depreciated.
*/
export const isDepreciable = (asset) => {
    if (!asset) return false;
    if (asset.depreciationMethod === 'NONE') return false;
    if (asset.status === 'RETIRED' || asset.status === 'CANCELLED') return false;
    const book = Number(asset.currentBookValue) || 0;
    return book > 0;
};

/* ============================================================
   SEED DATA — past depreciation runs + revaluations
   Kept small so history isn't overwhelming on first load.
   The assetId values reference assets from mockAssets.js.
   ============================================================ */

/*
  A depreciation run: one record per fiscal year per execution.
  Stores a summary of what was affected and the resulting changes.
*/
export const MOCK_DEPRECIATION_RUNS = [
    {
        id: 'run-001',
        fiscalYear: 'FY 2080/81',
        runAt: '2080-07-20T09:00:00Z',
        runBy: 'admin.gaurishankar',
        assetsAffected: 6,
        totalDepreciation: 1240000,
        notes: 'Opening depreciation for FY 2080/81.',
        /* Per-asset before/after snapshot — for audit */
        changes: [
            { assetId: 'a-001', before: 24000000, after: 23520000, amount: 480000 },
            { assetId: 'a-002', before: 850000, after: 680000, amount: 170000 },
            { assetId: 'a-003', before: 12000000, after: 11520000, amount: 480000 },
            { assetId: 'a-004', before: 18000000, after: 17640000, amount: 360000 },
            { assetId: 'a-005', before: 120000, after: 120000, amount: 0 },
            { assetId: 'a-006', before: 850000, after: 807500, amount: 42500 },
        ],
    },
];

/*
  A revaluation: an asset's book value was reset by an appraisal
  rather than by depreciation.
*/
export const MOCK_REVALUATIONS = [
    {
        id: 'rev-001',
        assetId: 'a-007',
        previousValue: 24000000,
        newValue: 28500000,
        reason: 'Land value increased due to road access improvements.',
        at: '2081-01-25T10:00:00Z',
        by: 'admin.gaurishankar',
    },
];

/* ============================================================
   HELPERS
   ============================================================ */

export const makeRunId = () =>
    `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const makeRevaluationId = () =>
    `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/*
  Format a compact amount for narrow cells.
  Uses English abbreviations so it never overflows.

  Examples:
    24000000  → "NPR 2.40 Cr"
    850000    → "NPR 8.50 L"
    42500     → "NPR 42.5 K"
    950       → "NPR 950"
    -120000   → "-NPR 1.20 L"
*/
export const formatNprShort = (value) => {
    const n = Number(value) || 0;
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_00_00_000) return `${sign}NPR ${(abs / 1_00_00_000).toFixed(2)} Cr`;
    if (abs >= 1_00_000) return `${sign}NPR ${(abs / 1_00_000).toFixed(2)} L`;
    if (abs >= 1_000) return `${sign}NPR ${(abs / 1_000).toFixed(1)} K`;
    return `${sign}NPR ${abs}`;
};