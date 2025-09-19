import { Router } from 'express';
import db from '../db/memory.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const user = db.users[req.userId];
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json({ id: user.id, phone: user.phone, name: user.name, profile: user.profile || {} });
});

router.put('/', authMiddleware, (req, res) => {
  const user = db.users[req.userId];
  if (!user) return res.status(404).json({ error: 'not found' });
  const { name, profile } = req.body || {};
  if (typeof name === 'string') user.name = name;
  if (profile && typeof profile === 'object') user.profile = { ...user.profile, ...profile };
  res.json({ ok: true, user: { id: user.id, phone: user.phone, name: user.name, profile: user.profile } });
});

export default router;


