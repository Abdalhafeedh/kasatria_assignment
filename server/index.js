// Express Server

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sheetsRouter from './routes/sheets.js';
import { getPublicConfig } from './services/googleSheets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

app.use('/api/sheets', sheetsRouter);
app.get('/api/config', (req, res) => res.json(getPublicConfig()));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('*', (req, res) => res.sendFile(join(__dirname, '../public/index.html')));

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${PORT}\n`);
});
