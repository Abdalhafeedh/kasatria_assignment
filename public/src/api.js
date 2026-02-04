/**
 * API Module
 * ==========
 * 
 * Handles all API calls to the backend server.
 * The frontend never directly accesses Google APIs with secrets.
 */

import { getAccessToken } from './auth.js';

const API_BASE = '/api';

/**
 * Generic API request helper
 * 
 * @param {string} endpoint - API endpoint (e.g., '/sheets/data')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - JSON response
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || `API Error: ${response.status}`);
    }

    return data;
}

/**
 * Fetch public configuration from server
 * This gets the Client ID without exposing it in frontend code
 * 
 * @returns {Promise<Object>} - Config object with clientId
 */
export async function fetchConfig() {
    return apiRequest('/config');
}

/**
 * Fetch sheet data from backend
 * The backend handles the Google Sheets API call securely
 * 
 * @returns {Promise<Array>} - Array of data objects
 */
export async function fetchSheetData() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        throw new Error("Not authenticated. Please sign in first.");
    }

    const response = await apiRequest('/sheets/data', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return response.data || [];
}

/**
 * Check if the backend is healthy
 * 
 * @returns {Promise<boolean>} - Whether backend is responding
 */
export async function checkHealth() {
    try {
        const response = await apiRequest('/health');
        return response.status === 'ok';
    } catch {
        return false;
    }
}
