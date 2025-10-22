import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Correctly uses the hook
import useRefreshToken from '../hooks/useRefreshToken';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth(); // Use the hook to get auth state

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            console.log("PersistLogin: Attempting to verify refresh token..."); // Debug
            try {
                await refresh();
                console.log("PersistLogin: Refresh successful."); // Debug
            } catch (err) {
                console.error("PersistLogin: Session refresh failed:", err); // Debug
                // If refresh fails, the user is effectively logged out.
                // Auth state should already be cleared by useRefreshToken's error handler.
            } finally {
                // Only stop loading once verification is attempted (success or fail)
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // --- CORE LOGIC CHANGE ---
        // ONLY attempt to refresh IF:
        // 1. We DON'T have an access token in the current auth state.
        // 2. We THINK the user should be logged in (e.g., based on a flag,
        //    but let's rely primarily on the lack of a token for simplicity now).
        //    If `auth.accessToken` exists, we trust it and don't need to refresh yet.
        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            // If we already have an access token in the state, trust it and stop loading.
            console.log("PersistLogin: Access token already exists in state. No refresh needed on mount."); // Debug
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
        // Depend only on `auth.accessToken` existence and `refresh` function stability.
    }, [auth?.accessToken, refresh]); // Re-run if token appears/disappears

    // Display loading indicator while verifying session
    return (
        <>
            {isLoading
                ? <p>Loading session...</p> // Consider a more robust loading indicator
                : <Outlet /> // Render child routes once loading is complete
            }
        </>
    );
};

export default PersistLogin;