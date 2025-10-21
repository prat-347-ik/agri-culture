import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useRefreshToken from '../hooks/useRefreshToken';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useContext(AuthContext);
    // Get the isLoggedIn flag from localStorage to handle the initial check
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                // Get a new access token using the refresh token cookie
                await refresh();
            } catch (err) {
                console.error("Session refresh failed:", err);
            } finally {
                // FINAL FIX: The loading state must only be set to false *after* the
                // async refresh operation has completed.
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // If the user is marked as logged in but we don't have an access token yet,
        // we must verify their session. Otherwise, we don't need to do anything.
        if (isLoggedIn && !auth?.accessToken) {
            verifyRefreshToken();
        } else {
            // If the user is not supposed to be logged in, or we already have a token,
            // we can stop loading immediately.
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    // We only want this effect to run on the initial component mount.
    // The refresh function and auth state are stable and shouldn't trigger re-runs here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Conditionally render the Outlet only when not loading.
    // This prevents child components from making API calls before the session is verified.
    return (
        <>
            {isLoading
                ? <p>Loading session...</p>
                : <Outlet />
            }
        </>
    );
};

export default PersistLogin;