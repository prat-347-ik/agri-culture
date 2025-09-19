import { Router } from 'express';
import db from '../db/memory.js';

const router = Router();

router.get('/contacts', (req, res) => {
  res.json(db.contacts);
});

router.get('/weather', (req, res) => {
  const { q } = req.query;
  res.json({ location: q || 'local', forecast: 'Sunny', tempC: 31 });
});

router.get('/prices', (req, res) => {
  res.json([
    { crop: 'Wheat', unit: 'quintal', price: 2300 },
    { crop: 'Rice', unit: 'quintal', price: 2500 },
  ]);
});

export default router;


