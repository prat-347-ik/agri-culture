import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';
import { useTranslation } from 'react-i18next';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth(); // <-- 1. Get setAuth from the hook
    const { i18n } = useTranslation();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            console.log("PersistLogin: Attempting to verify refresh token..."); // Debug
            try {
                // `data` will now be the { accessToken, user } object
                const data = await refresh(); 
                
                // --- THIS IS THE FIX ---
                // 2. Explicitly set the auth state with the new token AND user object
                setAuth({ accessToken: data.accessToken, user: data.user, isLoggedIn: true });
                // --- END OF FIX ---
                
                // Set language from the returned data
                i18n.changeLanguage(data.user.settings?.language || 'en');

                console.log("PersistLogin: Refresh successful. User role:", data.user.role); // Debug
            } catch (err) {
                console.error("PersistLogin: Session refresh failed:", err); // Debug
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Your existing logic
        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            console.log("PersistLogin: Access token already exists in state. No refresh needed on mount."); // Debug
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
        
        // 3. Add setAuth to the dependency array
    }, [auth?.accessToken, refresh, i18n, setAuth]); 

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