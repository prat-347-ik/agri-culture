import express from 'express';
const router = express.Router();
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from '../controllers/trainingController.js';

// Correct import: 'auth' is default, 'admin' is named
import auth, { admin } from '../middleware/auth.js'; 

// Public route for all logged-in users (uses 'auth')
router.route('/').get(auth, getAllCourses);

// Admin-only routes (uses 'auth' first, then 'admin')
router.route('/').post(auth, admin, createCourse);
router.route('/:id').put(auth, admin, updateCourse).delete(auth, admin, deleteCourse);

export default router;