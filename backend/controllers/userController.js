import User from '../models/User.js';
import geocoder from '../utils/geocoder.js';
import Listing from '../models/Listing.js'; // --- 1. Import Listing model ---

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.user.phoneNumber }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { fullName, age, gender, address, district, taluka, village, pincode } = req.body;

  try {
    // 1. Build the object of fields to update
    const fieldsToUpdate = {};
    if (fullName) fieldsToUpdate.fullName = fullName;
    if (age) fieldsToUpdate.age = age;
    if (gender) fieldsToUpdate.gender = gender;
    if (address) fieldsToUpdate.address = address;
    if (district) fieldsToUpdate.district = district;
    if (taluka) fieldsToUpdate.taluka = taluka;
    if (village) fieldsToUpdate.village = village;
    if (pincode) fieldsToUpdate.pincode = pincode;

    // 2. Geocode the address if any part of it was updated
    if (address || district || taluka || village || pincode) {
      // We must fetch the current user to build the full address string
      const currentUser = await User.findOne({ phone: req.user.phoneNumber });
      
      // Build the string using the new values, falling back to the current (old) values
      const geocodeString = `${village || currentUser.village}, ${district || currentUser.district}, ${pincode || currentUser.pincode}, India`;
      
      console.log(`Attempting to geocode: "${geocodeString}"`); 

      const loc = await geocoder.geocode(geocodeString);

      if (loc.length > 0) {
        console.log('Geocode successful:', loc[0]); 
        fieldsToUpdate.location = { // Add location to the update object
          type: 'Point',
          coordinates: [loc[0].longitude, loc[0].latitude],
        };
      } else {
        console.log('Geocode failed: No results found for that address.');
      }
    }

// Inside updateUserProfile, before findOneAndUpdate
const phoneToFind = req.user?.phoneNumber;
console.log(`Attempting findOneAndUpdate for phone: ${phoneToFind}`); // <-- ADD THIS
const updatedUser = await User.findOneAndUpdate(
  { phone: phoneToFind }, // Use the variable
  { $set: fieldsToUpdate },
  { new: true, runValidators: true }
).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);

  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Add this function ---
// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
export const updateUserSettings = async (req, res) => {
  try {
    const { language } = req.body;

    if (!language || !['en', 'mr'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language specified' });
    }

    const user = await User.findOne({ phone: req.user.phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.settings.language = language;
    await user.save();

    res.status(200).json(user); // Return the updated user
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Delete user account and all their data
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    // 1. Get the user's ID directly from the authenticated token.
    // The 'protect' middleware already verified the user.
    const userIdToDelete = req.user._id;

    // 2. Delete all listings created by this user
    await Listing.deleteMany({ user: userIdToDelete });

    // 3. (Optional) Delete any other related data (e.g., enrollments)
    // await Enrollment.deleteMany({ user: userIdToDelete });

    // 4. Delete the user
    await User.findByIdAndDelete(userIdToDelete);

    // 5. Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get all user profiles (for admin)
// @route   GET /api/user
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    // Find all users and select only their name and phone number
    const users = await User.find({}).select('fullName phone');
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
  };