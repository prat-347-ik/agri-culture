import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';
import { useTranslation } from 'react-i18next';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const { i18n } = useTranslation();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            console.log("PersistLogin: Attempting to verify refresh token..."); // Debug
            try {
                // --- THIS IS THE FIX ---
                // `data` will now be the { accessToken, user } object
                const data = await refresh(); 
                
                // Set language from the returned data
                i18n.changeLanguage(data.user.settings?.language || 'en');
                // --- END OF FIX ---

                console.log("PersistLogin: Refresh successful."); // Debug
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
        
    }, [auth?.accessToken, refresh, i18n]);

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