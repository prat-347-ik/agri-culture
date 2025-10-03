# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Agri-Culture is an agricultural platform built with a dual-server architecture:
1. **Frontend Server** (port 3000): Serves static HTML/CSS/JS files and handles HERE Maps integration
2. **Backend API Server** (port 5000): Full-featured Node.js/Express API with PostgreSQL database

The platform provides marketplace functionality for agricultural products, equipment rental system, farm mapping with HERE Maps, user enrollment services, and comprehensive admin management.

## Architecture

### Dual-Server Structure
```
agri-culture/
├── server.js              # Frontend static server (port 3000)
├── Frontend/               # Static HTML/CSS/JS files
├── backend/
│   ├── server.js          # Main API server (port 5000)
│   ├── models/            # Sequelize ORM models
│   ├── routes/            # Express.js route handlers
│   ├── middleware/        # Authentication, upload, error handling
│   └── config/            # Database and configuration
```

### Key Models and Relationships
- **User**: Central model with relationships to products, bids, rentals, enrollments, farms
- **Product**: Marketplace items with bidding system and image attachments
- **Enrollment**: Service provider registration forms with complex field structure
- **Farm**: Geospatial data for map integration
- **Image**: File attachments linked to products/rentals/enrollments/farms
- **Category**: Taxonomy for products and rentals

### Database
- **PostgreSQL** with **Sequelize ORM**
- UUID primary keys throughout
- Soft deletes and timestamps
- Complex associations between models
- Geospatial data support for farm mapping

## Development Commands

### Root Level (Frontend Server)
```bash
# Install dependencies and start frontend server (port 3000)
npm install
npm start          # Production mode
npm run dev        # Development with nodemon
```

### Backend API Server
```bash
cd backend

# Development workflow
npm install
npm run setup      # Create .env and directories
npm run migrate    # Run database migrations
npm run seed       # Add sample data
npm run dev        # Start with nodemon (port 5000)

# Testing and utilities
npm test           # Run Jest tests
npm run test-api   # Test API endpoints
npm run test-mock  # Test mock mode
npm run mock       # Run in mock mode (no database required)

# Production
npm start          # Production server
```

### Environment Setup
```bash
# Backend: Copy backend/env.example to backend/.env
cp backend/env.example backend/.env

# Root: Create .env from env-template.txt
cp env-template.txt .env
```

## Critical Architecture Decisions

### File Upload System (Priority Issue)
**Current Problem**: The enrollment endpoint (`/api/enroll`) currently accepts Base64-encoded images in the request body, storing large data directly in the database. This can:
- Crash the server with large files
- Pollute the database with binary data
- Cause performance issues

**Solution**: The `backend/middleware/upload.js` provides a secure multer-based file upload system with:
- File size limits (5MB default)
- Type validation (images only)
- Organized directory structure
- Error handling for file operations

**Implementation**: Refactor `backend/routes/enrollment.js` line 10-54 to use `upload.array('images', 5)` middleware instead of processing Base64 data.

### Mock Mode Operation
The backend gracefully handles database connection failures by falling back to mock mode with hardcoded data. This allows development without database setup but is not suitable for production.

### Dual Configuration System
- Frontend server reads environment from `config/config.js`
- Backend server uses standard `.env` with `dotenv`
- Both servers provide `/api/config` endpoints for HERE Maps API key distribution

## Common Development Patterns

### API Response Format
All API endpoints follow consistent structure:
```javascript
{
  "success": boolean,
  "message": string,
  "data": object,
  "error": string (optional)
}
```

### Authentication & Authorization
- JWT tokens for authentication
- Role-based access (farmer/admin)
- Protected routes use `auth` or `adminAuth` middleware
- Users can only access their own resources unless admin

### Database Queries
- Use Sequelize ORM with proper associations
- Include related models for comprehensive responses
- Implement pagination for list endpoints
- Use soft deletes for data preservation

### Error Handling
- Centralized error handling middleware
- Consistent error responses
- Proper HTTP status codes
- Database transaction rollbacks on failure

## Testing Strategy

### API Testing
```bash
# Test all endpoints
cd backend && npm run test-api

# Test individual components
cd backend && npm test

# Mock mode testing (no database required)
cd backend && npm run test-mock
```

### Database Testing
- Migrations must be reversible
- Seed data for consistent test environment
- Foreign key constraints properly defined
- Indexes on frequently queried fields

## Security Considerations

### File Upload Security
- Multer middleware validates file types and sizes
- Organized upload directories prevent path traversal
- File size limits prevent DoS attacks
- Only images allowed for most uploads

### API Security
- Helmet.js for security headers
- CORS properly configured
- Rate limiting (100 requests/15 minutes)
- Input validation with Joi
- Password hashing with bcryptjs
- SQL injection prevention via Sequelize ORM

## Frontend Integration

### HERE Maps Integration
- API key served through `/api/config` endpoint
- Frontend fetches configuration on page load
- Environment-based API key management
- Map functionality in `Frontend/map.html`

### Static File Serving
- Frontend server serves static files from `Frontend/` directory
- Route handlers for all HTML pages
- No build process required - vanilla HTML/CSS/JS

## Environment Variables

### Required for Backend
```bash
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_culture
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
HERE_MAPS_API_KEY=your_here_maps_key
```

### Required for Frontend
```bash
HERE_MAPS_API_KEY=your_here_maps_key
ENROLL_API_BASE=http://localhost:5000
PORT=3000
```

## Deployment Notes

### Database Migrations
Always run migrations before deployment:
```bash
cd backend && npm run migrate
```

### Production Considerations
- Set `NODE_ENV=production`
- Use production database credentials
- Configure CORS for production domain
- Set secure JWT secrets
- Configure file upload limits for production load
- Enable proper logging and monitoring