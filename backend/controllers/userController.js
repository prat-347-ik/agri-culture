import User from '../models/User.js';
import geocoder from '../utils/geocoder.js';

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

    // 3. Atomically find the user and update them
    const updatedUser = await User.findOneAndUpdate(
      { phone: req.user.phoneNumber }, // Find user by their phone number
      { $set: fieldsToUpdate },       // Set the new fields
      { new: true, runValidators: true } // Options: return the updated document and run validators
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

// @desc    Update user settings
// @route   PUT /api/user/settings
// @access  Private
export const updateUserSettings = async (req, res) => {
  const { language, notifications } = req.body;

  try {
    const user = await User.findOne({ phone: req.user.phoneNumber });

    if (user) {
      user.settings.language = language ?? user.settings.language;
      user.settings.notifications = notifications ?? user.settings.notifications;

      const updatedUser = await user.save();
      res.json(updatedUser.settings);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ phone: req.user.phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};