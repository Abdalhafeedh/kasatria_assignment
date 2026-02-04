/**
 * Main Application Entry Point
 * ============================
 * 
 * Kasatria – CSS3D "Periodic Table" with Google Sheet Data
 * 
 * Features:
 * - Google OAuth login
 * - Data from Google Sheets via backend API
 * - Tiles with photo, name, age, country, interest, net worth
 * - Color coding by net worth (Red < $100K, Orange >= $100K, Green >= $200K)
 * - 4 layout modes: Table (20x10), Sphere, Double Helix, Grid (5x4x10)
 */

// Import modules
import { MAX_TILES, ANIMATION } from './constants.js';
import {
    initUI,
    showLoginError,
    hideLoginError,
    setLoading,
    showToast,
    showApp,
    setUserLabel,
    getContainer,
    setupLayoutButtons,
    setupLoginButton
} from './ui.js';
import {
    initGoogleAuth,
    requestAccessToken,
    signOut,
    waitForGoogleScript
} from './auth.js';
import { fetchSheetData, fetchConfig, checkHealth } from './api.js';
import { createTiles } from './tiles.js';
import { generateAllTargets } from './layouts.js';
import {
    initScene,
    addMultipleToScene,
    startAnimation,
    transformToLayout
} from './scene.js';

// Application state
let tileObjects = [];
let layoutTargets = {};
let clientId = null;

/**
 * Handle successful authentication
 * @param {string} accessToken - OAuth access token
 * @param {Object|null} userInfo - User info from Google
 */
async function onAuthSuccess(accessToken, userInfo) {
    console.log("✅ Authentication successful");

    // Show user email if available
    if (userInfo?.email) {
        setUserLabel(userInfo.email);
    }

    // Start the main application
    await startApp();
}

/**
 * Handle authentication error
 * @param {string} error - Error message
 */
function onAuthError(error) {
    console.error("❌ Auth error:", error);
    showLoginError(error);
}

/**
 * Initialize and start the main application
 */
async function startApp() {
    try {
        setLoading(true);
        console.log("📊 Fetching data from backend...");

        // Fetch data from backend (which securely accesses Google Sheets)
        const data = await fetchSheetData();

        if (data.length < 1) {
            throw new Error("No data found in the sheet. Please check the Google Sheet configuration.");
        }

        console.log(`✅ Loaded ${data.length} records`);

        // Limit to maximum tiles (20x10 = 200)
        const tiles = data.slice(0, MAX_TILES);

        // Switch to app view
        showApp();

        // Initialize Three.js scene
        const container = getContainer();
        initScene(container);

        // Create tile objects
        tileObjects = createTiles(tiles);
        addMultipleToScene(tileObjects);

        // Generate layout targets
        layoutTargets = generateAllTargets(tileObjects.length);

        // Setup layout buttons
        setupLayoutButtons({
            onTable: () => transformToLayout(tileObjects, layoutTargets.table, ANIMATION.DEFAULT_DURATION),
            onSphere: () => transformToLayout(tileObjects, layoutTargets.sphere, ANIMATION.DEFAULT_DURATION),
            onHelix: () => transformToLayout(tileObjects, layoutTargets.helix, ANIMATION.DEFAULT_DURATION),
            onGrid: () => transformToLayout(tileObjects, layoutTargets.grid, ANIMATION.DEFAULT_DURATION),
            onSignOut: () => signOut(() => window.location.reload()),
        });

        // Start with table layout
        transformToLayout(tileObjects, layoutTargets.table, ANIMATION.DEFAULT_DURATION);

        // Start animation loop
        startAnimation();

        showToast(`Loaded ${tiles.length} records from Google Sheet`);
    } catch (error) {
        console.error("❌ Error loading app:", error);
        showLoginError(error?.message || String(error));
    } finally {
        setLoading(false);
    }
}

/**
 * Bootstrap the application
 */
async function bootstrap() {
    console.log("🚀 Bootstrap starting...");

    // Initialize UI
    initUI();
    console.log("✅ UI initialized");

    // Check backend health
    console.log("🔍 Checking backend...");
    const isHealthy = await checkHealth();

    if (!isHealthy) {
        showLoginError("Backend server is not running. Please start the server with 'npm start'");
        return;
    }
    console.log("✅ Backend is healthy");

    // Fetch configuration from backend (includes Client ID)
    console.log("⚙️ Fetching configuration...");
    try {
        const config = await fetchConfig();
        clientId = config.clientId;
        console.log("✅ Configuration loaded");
    } catch (error) {
        showLoginError("Failed to load configuration from server");
        return;
    }

    if (!clientId || !clientId.includes(".apps.googleusercontent.com")) {
        showLoginError("Invalid Google Client ID. Please check server .env file");
        return;
    }

    // Wait for Google Identity Services to load
    console.log("⏳ Waiting for Google script...");
    const googleLoaded = await waitForGoogleScript();

    if (!googleLoaded) {
        console.error("❌ Google script did not load");
        showLoginError("Google script did not load. Please refresh the page.");
        return;
    }
    console.log("✅ Google script loaded");

    // Initialize Google OAuth
    const authInitialized = initGoogleAuth(clientId, onAuthSuccess, onAuthError);

    if (!authInitialized) {
        console.error("❌ Auth initialization failed");
        return;
    }
    console.log("✅ Google Auth initialized");

    // Setup login button
    setupLoginButton(() => {
        console.log("🔘 Login button clicked!");
        hideLoginError();
        requestAccessToken();
    });
    console.log("✅ Login button setup complete");
    console.log("👆 Ready! Click 'Sign in with Google' to continue.");
}

// Start application when DOM is ready
window.addEventListener("load", bootstrap);
