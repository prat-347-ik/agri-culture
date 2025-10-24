import MarketPrice from '../models/MarketPrice.js';

/**
 * Get market prices from the database based on filters.
 */
export const getPrices = async (req, res) => {
  try {
    const { state, district, market, commodity } = req.query;

    // Build the filter object dynamically
    const filter = {};
    if (state) {
      // Use regex for case-insensitive partial matching
      filter.state = { $regex: new RegExp(`^${state}$`, 'i') }; // Exact match, case-insensitive
    }
    if (district) {
      filter.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }
    if (market) {
      filter.market = { $regex: new RegExp(`^${market}$`, 'i') };
    }
    if (commodity) {
      filter.commodity = { $regex: new RegExp(`^${commodity}$`, 'i') };
    }

    // Find prices, sort by most recent, and limit results
    const prices = await MarketPrice.find(filter)
      .sort({ arrivalDate: -1 }) // Sort by date descending
      .limit(500); // Limit to 500 results for performance

    if (!prices || prices.length === 0) {
      // Send 200 with empty array instead of 404, as it's a valid query with no results
      return res.status(200).json([]);
    }

    res.status(200).json(prices);
  } catch (error) {
    console.error("Error fetching prices from DB:", error);
    res.status(500).json({ message: "Server error while fetching prices.", error: error.message });
  }
};

// --- NEW FUNCTIONS FOR FILTERS ---

/**
 * Get a distinct list of all states.
 */
export const getDistinctStates = async (req, res) => {
  try {
    const states = await MarketPrice.distinct("state");
    res.status(200).json(states.sort()); // Sort alphabetically
  } catch (error) {
    console.error("Error fetching distinct states:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get a distinct list of districts, optionally filtered by state.
 */
export const getDistinctDistricts = async (req, res) => {
  try {
    const { state } = req.query;
    const filter = {};
    if (state) {
      filter.state = { $regex: new RegExp(`^${state}$`, 'i') };
    }

    const districts = await MarketPrice.distinct("district", filter);
    res.status(200).json(districts.sort()); // Sort alphabetically
  } catch (error) {
    console.error("Error fetching distinct districts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get a distinct list of markets, optionally filtered by state and/or district.
 */
export const getDistinctMarkets = async (req, res) => {
  try {
    const { state, district } = req.query;
    const filter = {};
    if (state) {
      filter.state = { $regex: new RegExp(`^${state}$`, 'i') };
    }
    if (district) {
      filter.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }

    const markets = await MarketPrice.distinct("market", filter);
    res.status(200).json(markets.sort()); // Sort alphabetically
  } catch (error) {
    console.error("Error fetching distinct markets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get a distinct list of commodities, optionally filtered by state, district, and/or market.
 */
export const getDistinctCommodities = async (req, res) => {
  try {
    const { state, district, market } = req.query;
    const filter = {};
    if (state) {
      filter.state = { $regex: new RegExp(`^${state}$`, 'i') };
    }
    if (district) {
      filter.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }
    if (market) {
      filter.market = { $regex: new RegExp(`^${market}$`, 'i') };
    }

    const commodities = await MarketPrice.distinct("commodity", filter);
    res.status(200).json(commodities.sort()); // Sort alphabetically
  } catch (error) {
    console.error("Error fetching distinct commodities:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
