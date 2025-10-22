import Listing from '../models/Listing.js';
import User from '../models/User.js';

// @desc    Create a new listing
export const createListing = async (req, res) => {
  try {
    // Destructure all expected fields from the request body
    const { category, name, description, price, listingType, images,rate_unit,service_details,serviceType } = req.body;
    const user = await User.findOne({ phone: req.user.phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newListing = new Listing({
      user: user._id,
      address: user.address, // --- THIS IS THE NEW LINE ---
      location: user.location, // <-- Add this line
      category,
      name,
      description,
      price,
      listingType, // Add listingType
      images,      // Add images
      rate_unit,
      serviceType, // Add the new field
      service_details
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error(error);
    // Provide more specific error messages for validation issues
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a listing
export const updateListing = async (req, res) => {
  // Destructure all updatable fields
  const { category, name, description, price, isAvailable, listingType, images, service_details, serviceType } = req.body;

  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const user = await User.findOne({ phone: req.user.phoneNumber });
    if (listing.user.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields if they are provided in the request
    listing.category = category || listing.category;
    listing.name = name || listing.name;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.isAvailable = isAvailable ?? listing.isAvailable;
    listing.images = images || listing.images;

    // Specifically handle listingType, as it can be intentionally set to null/undefined
// Handle conditional fields
// Handle conditional fields
    if (listing.category === 'Machineries') {
        listing.listingType = listingType || listing.listingType;
        listing.rate_unit = undefined;
        listing.skills = undefined;
    } else if (listing.category === 'Produces') {
        listing.rate_unit = rate_unit || listing.rate_unit;
        listing.listingType = undefined;
        listing.skills = undefined;
} else if (listing.category === 'Services') {
        listing.serviceType = serviceType || listing.serviceType;
        listing.service_details = service_details || listing.service_details;
        listing.listingType = undefined;
        listing.rate_unit = undefined;
    } else {
        listing.listingType = undefined;
        listing.rate_unit = undefined;
        listing.service_details = undefined;
    }

    listing = await listing.save();

    res.json(listing);
  } catch (error) {
    console.error(error);
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get all available listings (with optional location filter)
export const getListings = async (req, res) => {
  // Get lat/lon from the query string if they exist
  const { lat, lon, radius = 25 } = req.query; // Default radius of 25km

  try {
    // Start with the base query to find available listings
    let query = { isAvailable: true };

    // --- THIS IS THE CONDITIONAL LOGIC ---
    // If latitude and longitude are provided in the request, add the geospatial filter
    if (lat && lon) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)], // [longitude, latitude]
          },
          $maxDistance: parseInt(radius) * 1000, // Convert km to meters
        },
      };
    }

    // Execute the query
    const listings = await Listing.find(query).populate('user', 'fullName');
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all listings for the map
export const getMapListings = async (req, res) => {
  try {
    const listings = await Listing.find({ isAvailable: true }).populate({
      path: 'user',
      select: 'fullName phone location',
    });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'fullName phone');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get listings for the logged-in user
// @route   GET /api/listings/my-listings
// @access  Private
export const getMyListings = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.user.phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // --- ADD THIS LINE FOR DEBUGGING ---
    console.log(`[DEBUG] Fetching listings for user ID: ${user._id}`);
    
    const listings = await Listing.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Delete a listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user owns the listing
    const user = await User.findOne({ phone: req.user.phoneNumber });
    if (listing.user.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await listing.remove();

    res.json({ message: 'Listing removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};