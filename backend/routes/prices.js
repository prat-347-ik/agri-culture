import express from 'express';
import {
  getPrices,
  getDistinctStates,
  getDistinctDistricts,
  getDistinctMarkets,
  getDistinctCommodities
} from '../controllers/priceController.js';
import  auth  from '../middleware/auth.js'; // We can add this to protect routes

const router = express.Router();

// @route   GET /api/prices
// @desc    Get market prices based on query filters (state, district, etc.)
// @access  Public (or change to Private by adding 'protect')
router.get('/',auth, getPrices);

// --- NEW ROUTES FOR FILTERS ---

// @route   GET /api/prices/states
// @desc    Get a unique list of all states
// @access  Public
router.get('/states',auth, getDistinctStates);

// @route   GET /api/prices/districts
// @desc    Get a unique list of districts (can be filtered by state query)
// @access  Public
router.get('/districts',auth, getDistinctDistricts);

// @route   GET /api/prices/markets
// @desc    Get a unique list of markets (can be filtered by state/district query)
// @access  Public
router.get('/markets',auth, getDistinctMarkets);

// @route   GET /api/prices/commodities
// @desc    Get a unique list of commodities (can be filtered by state/district/market query)
// @access  Public
router.get('/commodities',auth, getDistinctCommodities);


export default router;
