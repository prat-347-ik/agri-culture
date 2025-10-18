import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import uploadRoutes from "./routes/upload.js"; // Only import the upload routes
import aiRoutes from './routes/ai.js'; // Use the AI route

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// Only the upload route is registered for now
app.use("/api", uploadRoutes);
app.use("/api/chat", aiRoutes);

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

