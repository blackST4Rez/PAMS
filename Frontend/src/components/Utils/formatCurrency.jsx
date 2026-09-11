// src/utils/formatCurrency.js

/**
 * Format a numeric amount (in NPR rupees) to a readable string.
 * Uses Nepali lakh/crore units.
 *
 *   formatNPR(248000000)          → "रू 24.80 करोड"
 *   formatNPR(850000)             → "रू 8.50 लाख"
 *   formatNPR(12400)              → "रू 12.4 हजार"
 *   formatNPR(500, {short:false}) → "रू 500"
 *   formatNPR(-28000000)          → "-रू 2.80 करोड"
 */
export const formatNPR = (amount, { short = true, decimals = 2 } = {}) => {
    if (amount == null || isNaN(amount)) return 'रू 0';

    const sign = amount < 0 ? '-' : '';
    const abs = Math.abs(amount);

    if (!short) {
        // Indian/Nepali grouping: 1,23,45,678
        return `${sign}रू ${abs.toLocaleString('en-IN')}`;
    }

    if (abs >= 1_00_00_000) {
        // 1 crore = 10,000,000
        return `${sign}रू ${(abs / 1_00_00_000).toFixed(decimals)} करोड`;
    }
    if (abs >= 1_00_000) {
        // 1 lakh = 100,000
        return `${sign}रू ${(abs / 1_00_000).toFixed(decimals)} लाख`;
    }
    if (abs >= 1_000) {
        return `${sign}रू ${(abs / 1_000).toFixed(1)} हजार`;
    }
    return `${sign}रू ${abs}`;
};

/**
 * Format a compact number for chart tooltips (e.g. "24.8 Cr", "8.5 L").
 * Useful inside Recharts <Tooltip formatter={...} />.
 */
export const formatNPRShort = (amount) => {
    if (amount == null || isNaN(amount)) return 'रू 0';
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 1_00_00_000) return `${sign}रू ${(abs / 1_00_00_000).toFixed(2)} Cr`;
    if (abs >= 1_00_000) return `${sign}रू ${(abs / 1_00_000).toFixed(2)} L`;
    if (abs >= 1_000) return `${sign}रू ${(abs / 1_000).toFixed(1)}K`;
    return `${sign}रू ${abs}`;
};

/**
 * Parse a display string like "रू 2.4 करोड" back to a number (useful for mocks).
 */
export const parseNPR = (str) => {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const cleaned = str.replace(/[^\d.\-]/g, '');
    const n = parseFloat(cleaned);
    if (isNaN(n)) return 0;
    if (str.includes('करोड')) return n * 1_00_00_000;
    if (str.includes('लाख')) return n * 1_00_000;
    if (str.includes('हजार')) return n * 1_000;
    return n;
};

/** Today as BS (Bikram Sambat). Fallback AD format until backend supplies BS. */
export const formatBS = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().slice(0, 10);
};