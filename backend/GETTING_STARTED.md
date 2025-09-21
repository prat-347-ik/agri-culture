# 🚀 Getting Started - Agri-Culture Backend

Quick setup guide to get your backend running for testing.

## Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
npm run setup
```
This will create `.env` file and upload directories.

### 3. Configure Database
Edit `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_culture
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Create Database
```bash
# Create PostgreSQL database
createdb agri_culture
```

### 5. Run Migrations
```bash
npm run migrate
```

### 6. Seed Sample Data
```bash
npm run seed
```

### 7. Start the Server
```bash
npm run dev
```

### 8. Test the API
```bash
# In another terminal
npm run test-api
```

## 🎉 You're Ready!

- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Admin Login**: admin@agri-culture.com / admin123

## Available Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/config` - Frontend configuration
- `GET /api/marketplace/products` - List products
- `GET /api/marketplace/categories` - List categories
- `GET /api/map/farms` - List farms
- `POST /api/enroll` - Submit enrollment form

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Admin (requires admin token)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/enrollments` - Manage enrollments

## Frontend Integration

Your frontend is already configured to work with this backend! The `/api/config` endpoint provides the HERE Maps API key.

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check your database credentials in `.env`
- Ensure database `agri_culture` exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### Missing Dependencies
- Run `npm install` again
- Check Node.js version: `node --version`

## Next Steps

1. **Test the API** with the test script
2. **Integrate with frontend** - update API calls to point to `http://localhost:5000`
3. **Add real data** through the admin panel or API
4. **Deploy to production** when ready

## Support

If you encounter any issues:
1. Check the console logs
2. Verify database connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

Happy coding! 🌱

