// Main Application - Kasatria 3D Data Visualization

import { MAX_TILES, ANIMATION } from './constants.js';
import {
    initUI, showLoginError, hideLoginError, setLoading,
    showToast, showApp, setUserLabel, getContainer, setupLayoutButtons, setupLoginButton
} from './ui.js';
import { initGoogleAuth, requestAccessToken, signOut, waitForGoogleScript } from './auth.js';
import { fetchSheetData, fetchConfig, checkHealth } from './api.js';
import { createTiles } from './tiles.js';
import { generateAllTargets } from './layouts.js';
import { initScene, addMultipleToScene, startAnimation, transformToLayout, focusOnPosition } from './scene.js';

let tileObjects = [];
let layoutTargets = {};
let clientId = null;

function onAuthSuccess(accessToken, userInfo) {
    console.log("Auth successful");
    if (userInfo?.email) setUserLabel(userInfo.email);
    startApp();
}

function onAuthError(error) {
    console.error("Auth error:", error);
    showLoginError(error);
}

async function startApp() {
    try {
        setLoading(true);
        const data = await fetchSheetData();

        if (data.length < 1) {
            throw new Error("No data found in sheet");
        }

        const tiles = data.slice(0, MAX_TILES);
        showApp();

        initScene(getContainer());

        tileObjects = createTiles(tiles, (obj) => focusOnPosition(obj.position, 1500));
        addMultipleToScene(tileObjects);

        layoutTargets = generateAllTargets(tileObjects.length);

        setupLayoutButtons({
            onTable: () => transformToLayout(tileObjects, layoutTargets.table, ANIMATION.DEFAULT_DURATION),
            onSphere: () => transformToLayout(tileObjects, layoutTargets.sphere, ANIMATION.DEFAULT_DURATION),
            onHelix: () => transformToLayout(tileObjects, layoutTargets.helix, ANIMATION.DEFAULT_DURATION),
            onGrid: () => transformToLayout(tileObjects, layoutTargets.grid, ANIMATION.DEFAULT_DURATION),
            onSignOut: () => signOut(() => window.location.reload()),
        });

        transformToLayout(tileObjects, layoutTargets.table, ANIMATION.DEFAULT_DURATION);
        startAnimation();
        showToast(`Loaded ${tiles.length} records`);
    } catch (error) {
        console.error("Error:", error);
        showLoginError(error?.message || String(error));
    } finally {
        setLoading(false);
    }
}

async function bootstrap() {
    initUI();

    const isHealthy = await checkHealth();
    if (!isHealthy) {
        showLoginError("Backend not running. Start with 'npm start'");
        return;
    }

    try {
        const config = await fetchConfig();
        clientId = config.clientId;
    } catch {
        showLoginError("Failed to load config");
        return;
    }

    if (!clientId?.includes(".apps.googleusercontent.com")) {
        showLoginError("Invalid Google Client ID");
        return;
    }

    const googleLoaded = await waitForGoogleScript();
    if (!googleLoaded) {
        showLoginError("Google script failed to load");
        return;
    }

    if (!initGoogleAuth(clientId, onAuthSuccess, onAuthError)) {
        return;
    }

    setupLoginButton(() => {
        hideLoginError();
        requestAccessToken();
    });
}

window.addEventListener("load", bootstrap);
