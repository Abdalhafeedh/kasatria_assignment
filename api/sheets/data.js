// Sheets Data Endpoint - Vercel Serverless Function

import { google } from 'googleapis';

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

async function fetchSheetData(accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: process.env.GOOGLE_SHEET_RANGE,
    });

    return rowsToObjects(response.data.values || []);
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing token'
            });
        }

        const data = await fetchSheetData(auth.substring(7));
        res.status(200).json({
            success: true,
            count: data.length,
            data: data.slice(0, 200)
        });
    } catch (error) {
        console.error('Sheet error:', error.message);
        const status = error.code === 401 || error.code === 403 ? 401 : 500;
        res.status(status).json({
            error: 'Error',
            message: error.message
        });
    }
}
