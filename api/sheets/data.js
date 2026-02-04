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

    // Use default range if not specified or use simple range
    const sheetId = process.env.GOOGLE_SHEET_ID;
    let range = process.env.GOOGLE_SHEET_RANGE || 'A1:F201';

    // If range doesn't include sheet name, that's fine - it uses the first sheet
    console.log('Fetching from Sheet ID:', sheetId);
    console.log('Using range:', range);

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
    });

    const rows = response.data.values || [];
    console.log('Rows received:', rows.length);

    if (rows.length > 0) {
        console.log('First row (headers):', rows[0]);
    }

    return rowsToObjects(rows);
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check environment variables first
    if (!process.env.GOOGLE_SHEET_ID) {
        return res.status(500).json({
            success: false,
            error: 'Configuration Error',
            message: 'GOOGLE_SHEET_ID environment variable is not set in Vercel'
        });
    }

    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Missing authorization token. Please sign in again.'
            });
        }

        const data = await fetchSheetData(auth.substring(7));

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data.slice(0, 200)
        });

    } catch (error) {
        console.error('Sheet API Error:', error);

        // Provide helpful error messages
        let userMessage = error.message;

        if (error.message?.includes('Unable to parse range')) {
            userMessage = `Invalid sheet range: ${process.env.GOOGLE_SHEET_RANGE}. Try using just "A1:F201" without sheet name.`;
        } else if (error.message?.includes('not found')) {
            userMessage = `Sheet not found. Check if GOOGLE_SHEET_ID is correct: ${process.env.GOOGLE_SHEET_ID?.substring(0, 15)}...`;
        } else if (error.code === 403 || error.message?.includes('forbidden')) {
            userMessage = 'Access denied. Make sure the Google Sheet is shared with your account or set to "Anyone with the link".';
        } else if (error.code === 401) {
            userMessage = 'Authentication failed. Please sign out and sign in again.';
        }

        return res.status(500).json({
            success: false,
            error: 'Sheet API Error',
            message: userMessage,
            details: {
                sheetId: process.env.GOOGLE_SHEET_ID?.substring(0, 15) + '...',
                range: process.env.GOOGLE_SHEET_RANGE || 'A1:F201 (default)'
            }
        });
    }
}
