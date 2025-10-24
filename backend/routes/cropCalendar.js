import express from 'express';
const router = express.Router();
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/cropCalendarController.js';

// Import your auth middleware
import auth, { admin } from '../middleware/auth.js';

// @route   /api/calendar

// Public route for all logged-in users (uses 'auth')
router.route('/').get(auth, getAllEvents);

// Admin-only routes (uses 'auth' first, then 'admin')
router.route('/').post(auth, admin, createEvent);
router.route('/:id').put(auth, admin, updateEvent).delete(auth, admin, deleteEvent);

export default router;