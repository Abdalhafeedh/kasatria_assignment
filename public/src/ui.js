/**
 * UI Module
 * =========
 * 
 * Handles all DOM interactions and UI state management.
 */

import { ANIMATION } from './constants.js';

// DOM Element References
const elements = {
    loginScreen: null,
    app: null,
    loginBtn: null,
    loginError: null,
    loading: null,
    container: null,
    userLabel: null,
    toast: null,
    btnTable: null,
    btnSphere: null,
    btnHelix: null,
    btnGrid: null,
    btnSignOut: null,
};

/**
 * Initialize DOM element references
 * Must be called after DOM is ready
 */
export function initUI() {
    elements.loginScreen = document.getElementById("loginScreen");
    elements.app = document.getElementById("app");
    elements.loginBtn = document.getElementById("loginBtn");
    elements.loginError = document.getElementById("loginError");
    elements.loading = document.getElementById("loading");
    elements.container = document.getElementById("container");
    elements.userLabel = document.getElementById("userLabel");
    elements.toast = document.getElementById("toast");
    elements.btnTable = document.getElementById("btnTable");
    elements.btnSphere = document.getElementById("btnSphere");
    elements.btnHelix = document.getElementById("btnHelix");
    elements.btnGrid = document.getElementById("btnGrid");
    elements.btnSignOut = document.getElementById("btnSignOut");
}

/**
 * Get DOM element references
 * @returns {Object} - Object containing all DOM element references
 */
export function getElements() {
    return elements;
}

/**
 * Show login error message
 * @param {string} message - Error message to display
 */
export function showLoginError(message) {
    if (elements.loginError) {
        elements.loginError.textContent = message;
        elements.loginError.classList.remove("hidden");
    }
}

/**
 * Hide login error message
 */
export function hideLoginError() {
    if (elements.loginError) {
        elements.loginError.classList.add("hidden");
    }
}

/**
 * Toggle loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
export function setLoading(isLoading) {
    if (elements.loading) {
        elements.loading.classList.toggle("hidden", !isLoading);
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
export function showToast(message) {
    if (elements.toast) {
        elements.toast.textContent = message;
        elements.toast.classList.remove("hidden");
        setTimeout(() => {
            elements.toast.classList.add("hidden");
        }, ANIMATION.TOAST_DURATION);
    }
}

/**
 * Switch from login screen to app view
 */
export function showApp() {
    if (elements.loginScreen) {
        elements.loginScreen.classList.add("hidden");
    }
    if (elements.app) {
        elements.app.classList.remove("hidden");
    }
}

/**
 * Set the user label (email) in the top bar
 * @param {string} email - User's email address
 */
export function setUserLabel(email) {
    if (elements.userLabel) {
        elements.userLabel.textContent = email;
    }
}

/**
 * Get the container element for Three.js renderer
 * @returns {HTMLElement|null} - Container element
 */
export function getContainer() {
    return elements.container;
}

/**
 * Setup layout button event listeners
 * @param {Object} callbacks - Object containing callback functions for each button
 */
export function setupLayoutButtons(callbacks) {
    if (elements.btnTable && callbacks.onTable) {
        elements.btnTable.addEventListener("click", callbacks.onTable);
    }
    if (elements.btnSphere && callbacks.onSphere) {
        elements.btnSphere.addEventListener("click", callbacks.onSphere);
    }
    if (elements.btnHelix && callbacks.onHelix) {
        elements.btnHelix.addEventListener("click", callbacks.onHelix);
    }
    if (elements.btnGrid && callbacks.onGrid) {
        elements.btnGrid.addEventListener("click", callbacks.onGrid);
    }
    if (elements.btnSignOut && callbacks.onSignOut) {
        elements.btnSignOut.addEventListener("click", callbacks.onSignOut);
    }
}

/**
 * Setup login button event listener
 * @param {Function} callback - Callback function for login button click
 */
export function setupLoginButton(callback) {
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener("click", callback);
    }
}
