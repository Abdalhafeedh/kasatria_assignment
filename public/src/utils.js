// Utility Functions

import { NET_WORTH_THRESHOLDS, NET_WORTH_COLORS } from './constants.js';

export function parseMoney(input) {
    if (input == null) return 0;
    const n = Number(String(input).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

export function getNetWorthColor(value) {
    if (value >= NET_WORTH_THRESHOLDS.HIGH) return NET_WORTH_COLORS.HIGH;
    if (value >= NET_WORTH_THRESHOLDS.MEDIUM) return NET_WORTH_COLORS.MEDIUM;
    return NET_WORTH_COLORS.LOW;
}

export function safeGet(obj, key) {
    if (obj[key] !== undefined) return String(obj[key]).trim();
    const trimmed = key.trim();
    for (const k of Object.keys(obj)) {
        if (k.trim() === trimmed) return String(obj[k]).trim();
    }
    return "";
}
