// src/utils/formatDate.js

/** BS months in order (Shrawan → Ashar). */
export const BS_MONTHS = [
    'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush',
    'Magh', 'Falgun', 'Chaitra', 'Baisakh', 'Jestha', 'Ashar',
];

/** Returns the current fiscal-year label, e.g. "FY 2081/82". */
export const currentFY = () => {
    const now = new Date();
    const adYear = now.getFullYear();
    // Rough conversion: AD + 56/57
    const bsYear = adYear + 56;
    // FY starts in Shrawan (mid-July). If we're before July, we're in the previous FY.
    const isBeforeShrawan = now.getMonth() < 6; // 0=Jan
    const fyStart = isBeforeShrawan ? bsYear - 1 : bsYear;
    return `FY ${fyStart}/${(fyStart + 1).toString().slice(-2)}`;
};

/** Relative time helper: "2 min ago", "1 hour ago", "3 days ago". */
export const timeAgo = (dateStr) => {
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((Date.now() - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${diff < 7200 ? '' : 's'} ago`;
    return `${Math.floor(diff / 86400)} day${diff < 172800 ? '' : 's'} ago`;
};