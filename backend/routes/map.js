import express from 'express';
const router = express.Router();

// @route   GET /api/map/locations
// @desc    Get all map locations
router.get('/locations', /* ... Controller logic here ... */);

export default router;