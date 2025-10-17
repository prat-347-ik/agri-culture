import express from 'express';
const router = express.Router();
// (Add authentication middleware)

// @route   POST /api/enrollments
// @desc    Create a new enrollment
router.post('/', /* ... Controller logic here ... */);

// @route   GET /api/enrollments
// @desc    Get all enrollments (for admin panel)
router.get('/', /* ... Controller logic for admin ... */);

export default router;