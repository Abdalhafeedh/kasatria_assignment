/**
 * Utility Functions
 * =================
 * 
 * Helper functions used across the application.
 */

import { NET_WORTH_THRESHOLDS, NET_WORTH_COLORS } from './constants.js';

/**
 * Parse a money string into a numeric value
 * Handles formats like "$100,000", "100K", etc.
 * 
 * @param {string|number} input - The money value to parse
 * @returns {number} - Parsed numeric value
 */
export function parseMoney(input) {
    if (input == null) return 0;
    const n = Number(String(input).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

/**
 * Get background color based on net worth
 * Red < $100K, Orange >= $100K, Green >= $200K
 * 
 * @param {number} netWorth - The net worth value
 * @returns {string} - RGBA color string
 */
export function getNetWorthColor(netWorth) {
    if (netWorth >= NET_WORTH_THRESHOLDS.HIGH) {
        return NET_WORTH_COLORS.HIGH;
    }
    if (netWorth >= NET_WORTH_THRESHOLDS.MEDIUM) {
        return NET_WORTH_COLORS.MEDIUM;
    }
    return NET_WORTH_COLORS.LOW;
}



/**
 * Safely get a property from an object, handling various key formats
 * (e.g., "Net Worth", " Net Worth ", "Net Worth ")
 * 
 * @param {Object} obj - The object to get the property from
 * @param {string} key - The key to look for
 * @returns {string} - The value or empty string
 */
export function safeGet(obj, key) {
    // Try exact match first
    if (obj[key] !== undefined) {
        return String(obj[key]).trim();
    }

    // Try with spaces trimmed
    const trimmedKey = key.trim();
    for (const objKey of Object.keys(obj)) {
        if (objKey.trim() === trimmedKey) {
            return String(obj[objKey]).trim();
        }
    }

    return "";
}
