// Sheets API Routes

import { Router } from 'express';
import { fetchSheetData } from '../services/googleSheets.js';

const router = Router();

router.get('/data', async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
        }

        const data = await fetchSheetData(auth.substring(7));
        res.json({ success: true, count: data.length, data: data.slice(0, 200) });
    } catch (error) {
        console.error('Sheet error:', error.message);
        const status = error.code === 401 || error.code === 403 ? 401 : 500;
        res.status(status).json({ error: 'Error', message: error.message });
    }
});

export default router;
