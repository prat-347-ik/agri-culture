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

    // NOTE: As per your project context, you might want to add:
    // const address = user.address;
    // const location = user.location;
    // ...and add 'address' and 'location' to the newListing object.
    // The code below does NOT currently do that, which is why the map
    // has to look at the user's location.

    const newListing = new Listing({
      user: user._id,
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
  const { category, name, description, price, isAvailable, listingType, images, service_details, serviceType, rate_unit } = req.body;

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

// @desc    Get all available listings
export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({ isAvailable: true }).populate('user', 'fullName');
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