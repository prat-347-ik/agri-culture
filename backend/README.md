# Agri-Culture Backend API

A comprehensive backend API for the Agri-Culture agricultural platform built with Node.js, Express.js, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Marketplace**: Products, bidding system, categories
- **Rentals**: Equipment rental management
- **Enrollment**: Service provider registration forms
- **Map Integration**: Farm locations and geospatial data
- **Admin Panel**: Complete admin management system
- **File Upload**: Image handling for products and services
- **Real-time Features**: Socket.io integration for live updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting
- **Real-time**: Socket.io

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=agri_culture
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key
   HERE_MAPS_API_KEY=your_here_maps_api_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb agri_culture
   
   # Run migrations and seed data
   npm run migrate
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)
- `POST /api/users/:id/verify` - Verify user (admin)

### Marketplace
- `GET /api/marketplace/products` - Get all products
- `GET /api/marketplace/products/:id` - Get product by ID
- `POST /api/marketplace/products` - Create product
- `PUT /api/marketplace/products/:id` - Update product
- `DELETE /api/marketplace/products/:id` - Delete product
- `POST /api/marketplace/products/:id/bid` - Place bid
- `GET /api/marketplace/categories` - Get categories

### Enrollment
- `POST /api/enroll` - Submit enrollment form
- `GET /api/enroll` - Get all enrollments (admin)
- `GET /api/enroll/:id` - Get enrollment by ID
- `PUT /api/enroll/:id/status` - Update enrollment status (admin)
- `GET /api/enroll/user/:userId` - Get user enrollments

### Map
- `GET /api/map/farms` - Get all farms
- `GET /api/map/farms/:id` - Get farm by ID
- `POST /api/map/farms` - Create farm
- `PUT /api/map/farms/:id` - Update farm
- `DELETE /api/map/farms/:id` - Delete farm
- `GET /api/map/weather` - Get weather data

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get users with filters
- `GET /api/admin/enrollments` - Get enrollments with filters
- `PUT /api/admin/enrollments/:id/approve` - Approve enrollment
- `PUT /api/admin/enrollments/:id/reject` - Reject enrollment
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Configuration
- `GET /api/config` - Get frontend configuration

## Database Schema

### Core Tables
- **users** - User accounts and profiles
- **categories** - Product and service categories
- **products** - Marketplace products
- **bids** - Bidding system
- **rentals** - Equipment rentals
- **enrollments** - Service provider registrations
- **farms** - Farm locations and data
- **images** - File attachments

### Key Features
- UUID primary keys
- Soft deletes
- Timestamps
- Foreign key relationships
- Geospatial data support

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... },
  "error": "Error details (if any)"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- SQL injection protection via Sequelize
- Password hashing with bcrypt
- Rate limiting

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Environment Variables
See `env.example` for all available configuration options.

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure CORS for production domain
5. Set up file upload storage
6. Configure rate limiting for production load

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

