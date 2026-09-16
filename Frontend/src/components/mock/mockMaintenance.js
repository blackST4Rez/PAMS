// src/mock/mockMaintenance.js
//
// Maintenance seed data + helpers.
//
// Seed schedules use RELATIVE dates so the app always has a realistic mix
// of overdue / due-soon / upcoming items on first load, regardless of
// when the app is actually run.

/* ============================================================
   DATE HELPERS (defined first — used by seed data below)
   ============================================================ */

const todayIso = () => new Date().toISOString().slice(0, 10);

const addDaysToIso = (dateLike, days) => {
    const d = new Date(dateLike);
    d.setDate(d.getDate() + Number(days));
    return d.toISOString().slice(0, 10);
};

/*
  Build a seed schedule with due dates relative to today.
  `daysFromToday` is how far in the future (positive) or past (negative)
  the NEXT DUE date should be. `lastDoneAt` is computed backwards from
  that by `frequencyDays`.
*/
const seedSchedule = ({
    id,
    assetId,
    title,
    description,
    frequencyDays,
    daysFromToday,
    createdBy = 'admin.gaurishankar',
}) => {
    const nextDueAt = addDaysToIso(todayIso(), daysFromToday);
    const lastDoneAt = addDaysToIso(nextDueAt, -frequencyDays);
    return {
        id,
        assetId,
        title,
        description,
        frequencyDays,
        lastDoneAt,
        nextDueAt,
        active: true,
        createdBy,
        createdAt: new Date().toISOString(),
    };
};

/* ============================================================
   SEED SCHEDULES — relative to today
   Three overdue, two due soon, three upcoming — a balanced mix
   so every bucket has data on first load.
   ============================================================ */
export const MOCK_MAINTENANCE_SCHEDULES = [
    seedSchedule({
        id: 'sch-001',
        assetId: 'a-002', // Fire Truck #1
        title: 'Annual engine service',
        description: 'Full engine service — oil, filters, belts, fluids.',
        frequencyDays: 365,
        daysFromToday: 120, // upcoming
    }),
    seedSchedule({
        id: 'sch-002',
        assetId: 'a-002', // Fire Truck #1
        title: 'Tire rotation & inspection',
        description: 'Rotate tires, check pressure and tread depth.',
        frequencyDays: 180,
        daysFromToday: -12, // overdue
    }),
    seedSchedule({
        id: 'sch-003',
        assetId: 'a-003', // Water Treatment Plant
        title: 'Quarterly filter replacement',
        description: 'Replace primary and secondary filters.',
        frequencyDays: 90,
        daysFromToday: -35, // overdue
    }),
    seedSchedule({
        id: 'sch-004',
        assetId: 'a-008', // Ward 7 Water Pump
        title: 'Monthly pump inspection',
        description: 'Check pump seals, pressure, and flow rate.',
        frequencyDays: 30,
        daysFromToday: 8, // due soon
    }),
    seedSchedule({
        id: 'sch-005',
        assetId: 'a-001', // Town Hall Building
        title: 'Annual structural inspection',
        description: 'Structural integrity check by certified engineer.',
        frequencyDays: 365,
        daysFromToday: 200, // upcoming
    }),
    seedSchedule({
        id: 'sch-006',
        assetId: 'a-004', // Community Center
        title: 'Quarterly cleaning & upkeep',
        description: 'Deep clean, paint touch-ups, minor repairs.',
        frequencyDays: 90,
        daysFromToday: -3, // overdue (just barely)
    }),
    seedSchedule({
        id: 'sch-007',
        assetId: 'a-003', // Water Treatment Plant
        title: 'Chlorination system calibration',
        description: 'Calibrate dosing equipment and verify chlorine levels.',
        frequencyDays: 60,
        daysFromToday: 22, // due soon
    }),
    seedSchedule({
        id: 'sch-008',
        assetId: 'a-006', // Ward 1 Road Section
        title: 'Road surface inspection',
        description: 'Check for cracks, potholes, and drainage issues.',
        frequencyDays: 180,
        daysFromToday: 90, // upcoming
    }),
];

/* ============================================================
   SEED LOGS
   Relative to today as well.
   ============================================================ */
const seedLog = ({
    id,
    scheduleId,
    assetId,
    title,
    description,
    cost,
    vendor,
    daysAgo,
    nextDueInDays,
    loggedBy = 'admin.gaurishankar',
}) => {
    const completedAt = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();
    return {
        id,
        scheduleId,
        assetId,
        title,
        description,
        cost,
        vendor,
        completedAt,
        nextDueAt: addDaysToIso(todayIso(), nextDueInDays),
        loggedBy,
        createdAt: completedAt,
    };
};

export const MOCK_MAINTENANCE_LOGS = [
    seedLog({
        id: 'mnt-001',
        scheduleId: 'sch-004',
        assetId: 'a-008',
        title: 'Monthly pump inspection',
        description: 'All seals intact, flow rate nominal.',
        cost: 2500,
        vendor: 'Local Technician',
        daysAgo: 22,
        nextDueInDays: 8,
    }),
    seedLog({
        id: 'mnt-002',
        scheduleId: 'sch-003',
        assetId: 'a-003',
        title: 'Quarterly filter replacement',
        description: 'Filters replaced as scheduled.',
        cost: 18500,
        vendor: 'AquaTech Suppliers',
        daysAgo: 125,
        nextDueInDays: -35,
    }),
    seedLog({
        id: 'mnt-003',
        scheduleId: 'sch-006',
        assetId: 'a-004',
        title: 'Quarterly cleaning & upkeep',
        description: 'Building cleaned, one window pane replaced.',
        cost: 6200,
        vendor: 'Municipal Cleaning Crew',
        daysAgo: 93,
        nextDueInDays: -3,
    }),
    seedLog({
        id: 'mnt-004',
        scheduleId: 'sch-002',
        assetId: 'a-002',
        title: 'Tire rotation & inspection',
        description: 'All four tires rotated. Two showing minor wear.',
        cost: 4200,
        vendor: 'Kathmandu Motors',
        daysAgo: 192,
        nextDueInDays: -12,
    }),
    seedLog({
        id: 'mnt-005',
        scheduleId: 'sch-001',
        assetId: 'a-002',
        title: 'Annual engine service',
        description: 'Full service completed. Replaced oil and air filters.',
        cost: 45000,
        vendor: 'Kathmandu Motors',
        daysAgo: 245,
        nextDueInDays: 120,
    }),
];

/* ============================================================
   HELPERS — unchanged, used by the provider and components
   ============================================================ */

export const makeScheduleId = () =>
    `sch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const makeLogId = () =>
    `mnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const addDays = (dateLike, days) => {
    const d = new Date(dateLike);
    d.setDate(d.getDate() + Number(days));
    return d.toISOString().slice(0, 10);
};

export const computeNextDue = (completedAt, frequencyDays) =>
    addDays(completedAt, frequencyDays);

export const daysUntil = (dueDate, from = new Date()) => {
    const d1 = new Date(dueDate);
    const d2 = new Date(from);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
};

export const scheduleBucket = (schedule, dueSoonThresholdDays = 30) => {
    if (!schedule.active) return 'INACTIVE';
    const days = daysUntil(schedule.nextDueAt);
    if (days < 0) return 'OVERDUE';
    if (days <= dueSoonThresholdDays) return 'DUE_SOON';
    return 'UPCOMING';
};

export const MAINTENANCE_BUCKETS = {
    OVERDUE: { label: 'Overdue', color: 'text-red-400' },
    DUE_SOON: { label: 'DueSoon', color: 'text-yellow-300' },
    UPCOMING: { label: 'Upcoming', color: 'text-green-300' },
    INACTIVE: { label: 'Inactive', color: 'text-white/40' },
};