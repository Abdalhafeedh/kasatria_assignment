/**
 * Google Sheets Service
 * =====================
 * 
 * Handles all Google Sheets API interactions on the server side.
 * This keeps API keys and tokens secure.
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Create OAuth2 client for verifying tokens
const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token from the frontend
 * 
 * @param {string} idToken - The ID token from Google Sign-In
 * @returns {Promise<Object>} - Verified user payload
 */
export async function verifyIdToken(idToken) {
    const ticket = await oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
        userId: payload['sub'],
        email: payload['email'],
        name: payload['name'],
        picture: payload['picture'],
    };
}

/**
 * Fetch data from Google Sheets using user's access token
 * 
 * @param {string} accessToken - User's OAuth access token
 * @returns {Promise<Array>} - Array of row objects
 */
export async function fetchSheetData(accessToken) {
    // Create OAuth2 client with user's access token
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = process.env.GOOGLE_SHEET_RANGE;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = response.data.values || [];
    return rowsToObjects(rows);
}

/**
 * Convert spreadsheet rows to objects using first row as headers
 * 
 * @param {Array<Array<string>>} rows - Raw rows from Google Sheets
 * @returns {Array<Object>} - Array of objects with header keys
 */
function rowsToObjects(rows) {
    if (!rows.length) return [];

    const headers = rows[0].map((h) => String(h || "").trim());

    return rows
        .slice(1)
        .filter((r) => r.some((cell) => String(cell || "").trim() !== ""))
        .map((r) => {
            const obj = {};
            headers.forEach((h, i) => (obj[h] = r[i] ?? ""));
            return obj;
        });
}

/**
 * Get configuration for the frontend
 * Only returns non-sensitive values
 * 
 * @returns {Object} - Public configuration
 */
export function getPublicConfig() {
    return {
        clientId: process.env.GOOGLE_CLIENT_ID,
    };
}
