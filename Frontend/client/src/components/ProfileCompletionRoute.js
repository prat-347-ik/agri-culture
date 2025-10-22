import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // We just created this

const ProfileCompletionRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();

    // Check if the user is logged in AND if their address is filled out
    // The `auth.user` object is now populated by your `Profile.js` page
    const hasCompletedProfile = auth.user && auth.user.address;

    if (!auth.user) {
        // This should be handled by ProtectedRoute, but as a fallback
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasCompletedProfile) {
        // User is logged in, but profile is incomplete.
        // Redirect them to the profile page.
        return <Navigate 
                    to="/profile" 
                    state={{ 
                        from: location, 
                        message: 'Please complete your profile to access this page.' 
                    }} 
                    replace 
                />;
    }

    // User is logged in and their profile is complete.
    return <Outlet />;
};

export default ProfileCompletionRoute;