/**
 * Authentication Module
 * =====================
 * 
 * Handles Google OAuth authentication using Google Identity Services (GIS).
 */

// OAuth scopes required for this application
const OAUTH_SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
].join(" ");

// State
let tokenClient = null;
let accessToken = null;

/**
 * Initialize Google OAuth client
 * 
 * @param {string} clientId - Google OAuth Client ID
 * @param {Function} onSuccess - Callback function on successful authentication
 * @param {Function} onError - Callback function on authentication error
 * @returns {boolean} - Whether initialization was successful
 */
export function initGoogleAuth(clientId, onSuccess, onError) {
    if (!window.google?.accounts?.oauth2) {
        onError("Google Identity Services did not load. Check your internet connection.");
        return false;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: OAUTH_SCOPES,
        callback: async (response) => {
            if (response.error) {
                onError(JSON.stringify(response, null, 2));
                return;
            }

            accessToken = response.access_token;

            // Fetch user info
            try {
                const userInfo = await fetchUserInfo();
                onSuccess(accessToken, userInfo);
            } catch (error) {
                // Auth succeeded but user info failed - still proceed
                onSuccess(accessToken, null);
            }
        },
    });

    return true;
}

/**
 * Request access token from user
 * This will show the Google sign-in consent dialog
 */
export function requestAccessToken() {
    if (tokenClient) {
        // prompt: "consent" shows account chooser + consent screen
        tokenClient.requestAccessToken({ prompt: "consent" });
    }
}

/**
 * Get the current access token
 * @returns {string|null} - Access token or null if not authenticated
 */
export function getAccessToken() {
    return accessToken;
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether user has a valid access token
 */
export function isAuthenticated() {
    return accessToken !== null;
}

/**
 * Fetch user info from Google's userinfo endpoint
 * @returns {Promise<Object>} - User info object with email, name, etc.
 */
async function fetchUserInfo() {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }

    return response.json();
}

/**
 * Sign out and revoke access token
 * @param {Function} onComplete - Callback after sign out completes
 */
export function signOut(onComplete) {
    if (accessToken && window.google?.accounts?.oauth2?.revoke) {
        google.accounts.oauth2.revoke(accessToken, () => {
            accessToken = null;
            onComplete();
        });
    } else {
        accessToken = null;
        onComplete();
    }
}

/**
 * Wait for Google Identity Services to load
 * 
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @param {number} intervalMs - Interval between attempts in milliseconds
 * @returns {Promise<boolean>} - Whether GIS loaded successfully
 */
export function waitForGoogleScript(maxAttempts = 50, intervalMs = 120) {
    return new Promise((resolve) => {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            attempts++;

            if (window.google?.accounts?.oauth2) {
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                resolve(false);
            }
        }, intervalMs);
    });
}
