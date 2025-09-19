# Agri-Culture Backend (Prototype)

Minimal Node/Express API to support the frontend. Uses in-memory data (no DB). Good for prototyping and local demos.

## Prerequisites
- Node.js 18+

## Setup
```bash
cd backend
npm install
# PowerShell
cp .env.example .env
# CMD
copy .env.example .env
npm run dev
```
Server runs at `http://localhost:3000` and serves the frontend from `Frontend/`.

Open `http://localhost:3000/` to load the app.

## Environment
- PORT (default 3000)
- JWT_SECRET (default dev-secret-change-me)

## Endpoints
- Auth
  - POST `/api/auth/request-otp` { phone }
  - POST `/api/auth/login` { phone, code } → returns `{ token, user }` (code is `123456` in prototype)
- Profile (requires `Authorization: Bearer <token>`)
  - GET `/api/profile`
  - PUT `/api/profile` { name?, profile? }
- Marketplace
  - GET `/api/market/items`
  - POST `/api/market/bid` { itemId, amount }
  - POST `/api/market/rent` { itemId, days, contact? }
  - POST `/api/market/buy` { itemId, quantity? }
- Contacts & Utilities
  - GET `/api/contacts`
  - GET `/api/weather?q=city`
  - GET `/api/prices`
- Misc
  - GET `/api/health`

## Notes
- Data resets on server restart.
- Hook up frontend actions to these APIs later (current frontend uses local UI logic).

