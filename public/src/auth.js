// Google OAuth Authentication

const SCOPES = "openid email profile https://www.googleapis.com/auth/spreadsheets.readonly";

let tokenClient = null;
let accessToken = null;

export function initGoogleAuth(clientId, onSuccess, onError) {
    if (!window.google?.accounts?.oauth2) {
        onError("Google Identity Services not loaded");
        return false;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: async (response) => {
            if (response.error) {
                onError(JSON.stringify(response));
                return;
            }
            accessToken = response.access_token;
            try {
                const userInfo = await fetchUserInfo();
                onSuccess(accessToken, userInfo);
            } catch {
                onSuccess(accessToken, null);
            }
        },
    });
    return true;
}

export function requestAccessToken() {
    tokenClient?.requestAccessToken({ prompt: "consent" });
}

export function getAccessToken() {
    return accessToken;
}

async function fetchUserInfo() {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user info");
    return res.json();
}

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

export function waitForGoogleScript(maxAttempts = 50, interval = 120) {
    return new Promise((resolve) => {
        let attempts = 0;
        const check = setInterval(() => {
            attempts++;
            if (window.google?.accounts?.oauth2) {
                clearInterval(check);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(check);
                resolve(false);
            }
        }, interval);
    });
}
