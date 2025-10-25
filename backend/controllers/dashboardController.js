import User from '../models/User.js';
import Listing from '../models/Listing.js';
import CropCalendarEvent from '../models/CropCalendarEvent.js';
// @desc    Get aggregated stats for the admin dashboard
// @route   GET /api/dashboard/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    // --- 2. ADD LOGIC FOR UPCOMING EVENTS ---
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    // --- END OF NEW LOGIC ---

    // 3. Get stats in parallel for speed
    const [
      totalUsers,
      totalListings,
      activeSellers,
      upcomingEventsCount, // <-- 4. ADD THIS
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments({ isAvailable: 'true' }),
      Listing.distinct('user'), // This gets an array of unique user IDs
      // --- 5. ADD THE NEW QUERY ---
      CropCalendarEvent.countDocuments({
        startDate: { $gte: now, $lte: thirtyDaysFromNow }
      })
      // --- END OF NEW QUERY ---
    ]);

    // 2. Get recent activity
    const recentListings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullName phone');

    const recentLogins = await User.find()
      .sort({ lastLoginAt: -1 }) // Sort by the new field
      .limit(5)
      .select('fullName phone lastLoginAt');

    // 3. Send all data in one response
    res.json({
      stats: {
        totalUsers,
        totalListings,
        activeSellers: activeSellers.length,
        upcomingEventsCount, // <-- 6. ADD TO RESPONSE
      },
      recentListings,
      recentLogins,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};