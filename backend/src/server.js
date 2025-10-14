import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory stores for prototype
const db = {
  users: {}, // phone -> { id, phone, name, profile }
  tokens: {}, // token -> userId
  marketplace: {
    items: [
      { id: 'itm-tractor', type: 'buy', title: 'Tractor', description: 'High-quality farming tractor', price: 12000 },
      { id: 'itm-seeds', type: 'buy', title: 'Seeds Package', description: 'Premium quality seeds', price: 100 },
      { id: 'itm-pesticide', type: 'bid', title: 'Pesticide', description: 'Eco-friendly pesticide', currentBid: 50 },
      { id: 'itm-harvester', type: 'bid', title: 'Harvester', description: 'Advanced harvesting machine', currentBid: 15000 },
      { id: 'itm-tractor-rent', type: 'rent', title: 'Tractor', description: 'Daily tractor rental', ratePerDay: 80 },
    ],
    bids: [],
    rentals: [],
    orders: []
  },
  contacts: [
    { id: 'c1', category: 'government', role: 'Taluka Office', name: 'Taluka Office', phone: '+91 2222-111111' },
    { id: 'c2', category: 'emergency', role: 'Police Station', name: 'Police Station', phone: '100' },
    { id: 'c3', category: 'services', role: 'Soil Testing', name: 'Soil Testing Lab', phone: '+91 2222-333333' },
  ],
};

// Auth (prototype OTP-less)
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('0123456789', 6);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.post('/api/auth/request-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'phone required' });
  // Prototype: return a static code
  const code = '123456';
  res.json({ success: true, code });
});

app.post('/api/auth/login', (req, res) => {
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

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Profile endpoints
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = db.users[req.userId];
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json({ id: user.id, phone: user.phone, name: user.name, profile: user.profile || {} });
});

app.put('/api/profile', authMiddleware, (req, res) => {
  const user = db.users[req.userId];
  if (!user) return res.status(404).json({ error: 'not found' });
  const { name, profile } = req.body || {};
  if (typeof name === 'string') user.name = name;
  if (profile && typeof profile === 'object') user.profile = { ...user.profile, ...profile };
  res.json({ ok: true, user: { id: user.id, phone: user.phone, name: user.name, profile: user.profile } });
});

// Marketplace
app.get('/api/market/items', (req, res) => {
  res.json(db.marketplace.items);
});

app.post('/api/market/bid', (req, res) => {
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

app.post('/api/market/rent', (req, res) => {
  const { itemId, days, contact } = req.body || {};
  const item = db.marketplace.items.find(i => i.id === itemId && i.type === 'rent');
  if (!item) return res.status(404).json({ error: 'item not found' });
  if (!days || days <= 0) return res.status(400).json({ error: 'invalid days' });
  const rental = { id: `rent_${Date.now()}`, itemId, days, contact: contact || null, ts: Date.now() };
  db.marketplace.rentals.push(rental);
  res.json({ ok: true, rental });
});

app.post('/api/market/buy', (req, res) => {
  const { itemId, quantity } = req.body || {};
  const item = db.marketplace.items.find(i => i.id === itemId && i.type === 'buy');
  if (!item) return res.status(404).json({ error: 'item not found' });
  const order = { id: `ord_${Date.now()}`, itemId, quantity: quantity || 1, price: item.price, ts: Date.now() };
  db.marketplace.orders.push(order);
  res.json({ ok: true, order });
});

// Contacts and utilities
app.get('/api/contacts', (req, res) => {
  res.json(db.contacts);
});

app.get('/api/weather', (req, res) => {
  const { q } = req.query;
  res.json({ location: q || 'local', forecast: 'Sunny', tempC: 31 });
});

app.get('/api/prices', (req, res) => {
  res.json([
    { crop: 'Wheat', unit: 'quintal', price: 2300 },
    { crop: 'Rice', unit: 'quintal', price: 2500 },
  ]);
});

// Serve static Frontend
const frontendDir = path.resolve(projectRoot, 'Frontend');
app.use('/', express.static(frontendDir));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});



