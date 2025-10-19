import Listing from '../models/Listing.js';
import User from '../models/User.js';

// @desc    Create a new listing
export const createListing = async (req, res) => {
  try {
    const { category, name, description, price } = req.body;
    const user = await User.findOne({ phone: req.user.phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newListing = new Listing({
      user: user._id,
      category,
      name,
      description,
      price,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error(error);
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

// @desc    Update a listing
export const updateListing = async (req, res) => {
  const { category, name, description, price, isAvailable } = req.body;

  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user owns the listing
    const user = await User.findOne({ phone: req.user.phoneNumber });
    if (listing.user.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    listing.category = category || listing.category;
    listing.name = name || listing.name;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.isAvailable = isAvailable ?? listing.isAvailable;

    listing = await listing.save();

    res.json(listing);
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