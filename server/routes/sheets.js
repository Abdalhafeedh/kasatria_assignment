/**
 * Sheets API Routes
 * =================
 * 
 * Endpoints for Google Sheets data access.
 */

import { Router } from 'express';
import { fetchSheetData } from '../services/googleSheets.js';

const router = Router();

/**
 * GET /api/sheets/data
 * 
 * Fetch data from the Google Sheet.
 * Requires Authorization header with Bearer token.
 */
router.get('/data', async (req, res) => {
    try {
        // Extract access token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid Authorization header'
            });
        }

        const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

        // Fetch data from Google Sheets
        const data = await fetchSheetData(accessToken);

        // Limit to 200 records (20x10 grid)
        const limitedData = data.slice(0, 200);

        res.json({
            success: true,
            count: limitedData.length,
            data: limitedData,
        });
    } catch (error) {
        console.error('Error fetching sheet data:', error);

        // Handle specific Google API errors
        if (error.code === 401 || error.code === 403) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired access token'
            });
        }

        res.status(500).json({
            error: 'Server Error',
            message: error.message
        });
    }
});

export default router;
