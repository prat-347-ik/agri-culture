import User from '../models/User.js';
import geocoder from '../utils/geocoder.js'; // <-- ADD THIS LINE

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
    const user = await User.findOne({ phone: req.user.phoneNumber });

    if (user) {
      user.fullName = fullName || user.fullName;
      user.age = age || user.age;
      user.gender = gender || user.gender;
      user.address = address || user.address;
      user.district = district || user.district;
      user.taluka = taluka || user.taluka;
      user.village = village || user.village;
      user.pincode = pincode || user.pincode;

      // Geocoding Logic
      if (address || district || taluka || village || pincode) {
        const loc = await geocoder.geocode(
          `${user.address}, ${user.village}, ${user.taluka}, ${user.district}, ${user.pincode}`
        );
        if (loc.length > 0) {
          user.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
          };
        }
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
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