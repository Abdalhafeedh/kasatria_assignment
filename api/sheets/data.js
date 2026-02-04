// Sheets Data Endpoint - Vercel Serverless Function

import { google } from 'googleapis';

function rowsToObjects(rows) {
    if (!rows || !rows.length) return { data: [], rawRowCount: 0 };

    const headers = rows[0].map(h => String(h || "").trim());
    const dataRows = rows.slice(1)
        .filter(r => r && r.some(cell => String(cell || "").trim()))
        .map(r => {
            const obj = {};
            headers.forEach((h, i) => obj[h] = r[i] ?? "");
            return obj;
        });

    return {
        data: dataRows,
        rawRowCount: rows.length,
        headers: headers
    };
}

async function fetchSheetData(accessToken, sheetId, range) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('=== SHEET FETCH DEBUG ===');
    console.log('Sheet ID:', sheetId);
    console.log('Range:', range);

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
    });

    console.log('API Response status:', response.status);
    console.log('Values received:', response.data.values?.length || 0, 'rows');

    if (response.data.values && response.data.values.length > 0) {
        console.log('First row:', JSON.stringify(response.data.values[0]));
        if (response.data.values.length > 1) {
            console.log('Second row:', JSON.stringify(response.data.values[1]));
        }
    }

    return response.data.values || [];
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    // Try without sheet name if the current range doesn't work
    let range = process.env.GOOGLE_SHEET_RANGE || 'A1:F201';

    // Check environment variables
    if (!sheetId) {
        return res.status(500).json({
            success: false,
            error: 'Configuration Error',
            message: 'GOOGLE_SHEET_ID is not set'
        });
    }

    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Missing authorization token'
            });
        }

        const token = auth.substring(7);
        let rows;

        try {
            // First attempt with configured range
            rows = await fetchSheetData(token, sheetId, range);
        } catch (rangeError) {
            console.log('First attempt failed:', rangeError.message);
            // If Sheet1! prefix fails, try without it
            if (range.includes('!')) {
                const simpleRange = range.split('!')[1] || 'A1:F201';
                console.log('Retrying with simple range:', simpleRange);
                rows = await fetchSheetData(token, sheetId, simpleRange);
            } else {
                throw rangeError;
            }
        }

        const result = rowsToObjects(rows);

        return res.status(200).json({
            success: true,
            count: result.data.length,
            data: result.data.slice(0, 200),
            debug: {
                rawRowsReceived: result.rawRowCount,
                headers: result.headers,
                configuredRange: range,
                sheetIdPrefix: sheetId.substring(0, 10)
            }
        });

    } catch (error) {
        console.error('=== SHEET API ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

        return res.status(500).json({
            success: false,
            error: 'Sheet API Error',
            message: error.message,
            code: error.code,
            debug: {
                range: range,
                sheetIdPrefix: sheetId?.substring(0, 10)
            }
        });
    }
}
