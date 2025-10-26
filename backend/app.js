import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // 1. Import cookie-parser
import uploadRoutes from "./routes/upload.js"; // Only import the upload routes
import aiRoutes from './routes/ai.js'; // Use the AI route
import userRoutes from './routes/user.js'; // Import user routes
import authRoutes from './routes/auth.js'; // 1. Import auth routes
import listingRoutes from './routes/listings.js'; // Import listing routes
import contactRoutes from './routes/contact.js';
import weatherRoutes from './routes/weather.js'; // Import weather routes
import trainingRoutes from './routes/training.js'; // Import training routes
import calendarRoutes from './routes/cropCalendar.js';
import insuranceRoutes from './routes/insurance.js';
import priceRoutes from './routes/prices.js'; // <--- 1. IMPORT YOUR NEW PRICE ROUTES
import adminRoutes from './routes/admin.js'; // Import admin routes
import dashboardRoutes from './routes/dashboard.js'; // <-- 1. IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. DEFINE YOUR ALLOWED ORIGINS ---
//    (Get your Netlify URL after you create the site)
const allowedOrigins = [
  'http://localhost:3000',                 // For local development
// We will add the Netlify URL here later;
];


// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow cookies
}));
app.use(cookieParser()); // 2. Use cookie-parser middleware

// API Routes
// Only the upload route is registered for now
app.use("/api", uploadRoutes);
app.use("/api/chat", aiRoutes);
app.use("/api/user", userRoutes); // Register user routes
app.use("/api/auth", authRoutes); // 2. Register auth routes
app.use('/api/listings', listingRoutes); // Register listing routes
app.use('/api/contacts', contactRoutes); // 2. Add this line
app.use('/api/weather', weatherRoutes); // Register weather routes
app.use('/api/training', trainingRoutes); // Register training routes
app.use('/api/calendar', calendarRoutes); // <--- 2. REGISTER YOUR NEW CALENDAR ROUTES
app.use('/api/insurance', insuranceRoutes); // Register insurance routes
app.use('/api/prices', priceRoutes); // <--- 2. REGISTER YOUR NEW PRICE ROUTES
app.use('/api/admin', adminRoutes); // Register admin routes
app.use('/api/dashboard', dashboardRoutes); // <-- 2. REGISTER DASHBOARD ROUTES





// Function to connect to MongoDB and start the server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the database
connectDB();

