/**
 * Application Constants
 * =====================
 * 
 * Centralized constants for layout configurations and styling.
 */

// Layout configurations
export const LAYOUT = {
    // Table layout: 20 columns x 10 rows
    TABLE: {
        COLS: 20,
        ROWS: 10,
        X_SPACING: 140,
        Y_SPACING: 180,
    },

    // Grid layout: 5 x 4 x 10 (as per Image C requirements)
    GRID: {
        X: 5,
        Y: 4,
        Z: 10,
        X_SPACING: 400,
        Y_SPACING: 300,
        Z_SPACING: 500,
    },

    // Sphere layout
    SPHERE: {
        RADIUS: 900,
    },

    // Double Helix layout
    HELIX: {
        RADIUS: 900,
        ANGLE_STEP: 0.45,
        Y_STEP: 18,
        Y_OFFSET: 450,
        STRAND_SEPARATION: 6,
    },
};

// Net worth color thresholds (in dollars)
export const NET_WORTH_THRESHOLDS = {
    HIGH: 200000,    // >= $200K = Green
    MEDIUM: 100000,  // >= $100K = Orange
    // < $100K = Red
};

// Net worth colors (RGBA for semi-transparency)
export const NET_WORTH_COLORS = {
    HIGH: "rgba(34, 197, 94, 0.78)",    // Green
    MEDIUM: "rgba(249, 115, 22, 0.78)", // Orange
    LOW: "rgba(239, 68, 68, 0.78)",     // Red
};

// Camera settings
export const CAMERA = {
    FOV: 40,
    NEAR: 1,
    FAR: 10000,
    INITIAL_Z: 3000,
    MIN_DISTANCE: 500,
    MAX_DISTANCE: 6000,
};

// Animation settings
export const ANIMATION = {
    DEFAULT_DURATION: 2000,
    TOAST_DURATION: 3200,
};

// Maximum tiles to display (20 x 10 = 200)
export const MAX_TILES = 200;
