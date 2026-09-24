// src/utils/formatCurrency.js

/**
 * Format a numeric amount (in NPR rupees) to a readable string.
 * Uses Nepali lakh/crore units for the full form. Intended for
 * wide layouts (asset detail drawer, hero stats) where there is
 * room for the Devanagari units.
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
 * Format a compact amount for narrow cells.
 * Uses English abbreviations so it never overflows a table column
 * or a mobile card. Output is ASCII-only for consistent rendering
 * regardless of font fallback.
 *
 *   formatNPRShort(24000000)  → "NPR 2.40 Cr"
 *   formatNPRShort(850000)    → "NPR 8.50 L"
 *   formatNPRShort(42500)     → "NPR 42.5 K"
 *   formatNPRShort(950)       → "NPR 950"
 *   formatNPRShort(-120000)   → "-NPR 1.20 L"
 *   formatNPRShort(0)         → "NPR 0"
 */
export const formatNPRShort = (amount) => {
    if (amount == null || isNaN(amount)) return 'NPR 0';
    const n = Number(amount);
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_00_00_000) return `${sign}NPR ${(abs / 1_00_00_000).toFixed(2)} Cr`;
    if (abs >= 1_00_000) return `${sign}NPR ${(abs / 1_00_000).toFixed(2)} L`;
    if (abs >= 1_000) return `${sign}NPR ${(abs / 1_000).toFixed(1)} K`;
    return `${sign}NPR ${abs}`;
};

/**
 * Parse a display string back to a number. Handles both the full
 * Devanagari form ("रू 2.4 करोड") and the compact ASCII form
 * ("NPR 2.40 Cr", "NPR 8.5 L", "NPR 42.5 K").
 *
 *   parseNPR("रू 2.4 करोड")   → 24000000
 *   parseNPR("NPR 8.50 L")    → 850000
 *   parseNPR("NPR 42.5 K")    → 42500
 *   parseNPR(24000000)        → 24000000
 */
export const parseNPR = (str) => {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const cleaned = str.replace(/[^\d.\-]/g, '');
    const n = parseFloat(cleaned);
    if (isNaN(n)) return 0;
    if (str.includes('करोड') || str.includes('Cr')) return n * 1_00_00_000;
    if (str.includes('लाख') || str.includes('L')) return n * 1_00_000;
    if (str.includes('हजार') || str.includes('K')) return n * 1_000;
    return n;
};

/** Today as BS (Bikram Sambat). Fallback AD format until backend supplies BS. */
export const formatBS = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().slice(0, 10);
};