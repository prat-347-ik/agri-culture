import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import marketRoutes from './routes/market.js';
import miscRoutes from './routes/misc.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/market', marketRoutes);
app.use('/api', miscRoutes);
app.use('/api/admin', adminRoutes);

// Serve static Frontend
const frontendDir = path.resolve(projectRoot, 'Frontend');
app.use('/', express.static(frontendDir));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

export default app;


