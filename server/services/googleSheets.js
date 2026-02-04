// Google Sheets Service

import { google } from 'googleapis';

export async function fetchSheetData(accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: process.env.GOOGLE_SHEET_RANGE,
    });

    return rowsToObjects(response.data.values || []);
}

function rowsToObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map(h => String(h || "").trim());
    return rows.slice(1)
        .filter(r => r.some(cell => String(cell || "").trim()))
        .map(r => {
            const obj = {};
            headers.forEach((h, i) => obj[h] = r[i] ?? "");
            return obj;
        });
}

export function getPublicConfig() {
    return { clientId: process.env.GOOGLE_CLIENT_ID };
}
