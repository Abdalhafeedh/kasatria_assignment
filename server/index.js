/**
 * Kasatria Three.js Assignment - Express Server
 * ==============================================
 * 
 * This server:
 * 1. Serves the static frontend files
 * 2. Provides API endpoints for Google Sheets data
 * 3. Keeps sensitive credentials secure on the server
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sheetsRouter from './routes/sheets.js';
import { getPublicConfig } from './services/googleSheets.js';

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(join(__dirname, '../public')));

// API Routes
app.use('/api/sheets', sheetsRouter);

// Endpoint to get public config (safe for frontend)
app.get('/api/config', (req, res) => {
    res.json(getPublicConfig());
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ====================================');
    console.log('   Kasatria Three.js Assignment');
    console.log('   ====================================');
    console.log('');
    console.log(`   Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('   API Endpoints:');
    console.log(`   - GET /api/config      → Public config`);
    console.log(`   - GET /api/sheets/data → Sheet data (requires auth)`);
    console.log(`   - GET /api/health      → Health check`);
    console.log('');
    console.log('   Press Ctrl+C to stop');
    console.log('====================================');
    console.log('');
});
