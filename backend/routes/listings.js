import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getMapListings,
} from '../controllers/listingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private
router.post('/', auth, createListing);

// @route   GET /api/listings
// @desc    Get all available listings
// @access  Public
router.get('/', getListings);

// @route   GET /api/listings/map
// @desc    Get all listings with location data for the map
// @access  Public
router.get('/map', getMapListings);

// @route   GET /api/listings/:id
// @desc    Get a single listing by ID
// @access  Public
router.get('/:id', getListingById);

// @route   PUT /api/listings/:id
// @desc    Update a listing
// @access  Private
router.put('/:id', auth, updateListing);

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', auth, deleteListing);

export default router;  