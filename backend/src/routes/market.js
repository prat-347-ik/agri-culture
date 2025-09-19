import { Router } from 'express';
import db from '../db/memory.js';

const router = Router();

router.get('/items', (req, res) => {
  res.json(db.marketplace.items);
});

router.post('/bid', (req, res) => {
  const { itemId, amount } = req.body || {};
  const item = db.marketplace.items.find(i => i.id === itemId && i.type === 'bid');
  if (!item) return res.status(404).json({ error: 'item not found' });
  if (typeof amount !== 'number' || amount <= (item.currentBid || 0)) {
    return res.status(400).json({ error: 'bid too low' });
  }
  item.currentBid = amount;
  db.marketplace.bids.push({ id: `bid_${Date.now()}`, itemId, amount, ts: Date.now() });
  res.json({ ok: true, currentBid: item.currentBid });
});

router.post('/rent', (req, res) => {
  const { itemId, days, contact } = req.body || {};
  const item = db.marketplace.items.find(i => i.id === itemId && i.type === 'rent');
  if (!item) return res.status(404).json({ error: 'item not found' });
  if (!days || days <= 0) return res.status(400).json({ error: 'invalid days' });
  const rental = { id: `rent_${Date.now()}`, itemId, days, contact: contact || null, ts: Date.now() };
  db.marketplace.rentals.push(rental);
  res.json({ ok: true, rental });
});

router.post('/buy', (req, res) => {
  const { itemId, quantity } = req.body || {};
  const item = db.marketplace.items.find(i => i.id === itemId && i.type === 'buy');
  if (!item) return res.status(404).json({ error: 'item not found' });
  const order = { id: `ord_${Date.now()}`, itemId, quantity: quantity || 1, price: item.price, ts: Date.now() };
  db.marketplace.orders.push(order);
  res.json({ ok: true, order });
});

export default router;


