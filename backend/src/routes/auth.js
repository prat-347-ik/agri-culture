import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/memory.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

router.post('/request-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'phone required' });
  const code = '123456';
  res.json({ success: true, code });
});

router.post('/login', (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) return res.status(400).json({ error: 'phone and code required' });
  if (code !== '123456') return res.status(401).json({ error: 'invalid code' });

  let user = Object.values(db.users).find(u => u.phone === phone);
  if (!user) {
    user = { id: `usr_${Date.now()}`, phone, name: 'Farmer', profile: {} };
    db.users[user.id] = user;
  }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
  db.tokens[token] = user.id;
  res.json({ token, user: { id: user.id, phone: user.phone, name: user.name } });
});

export default router;


