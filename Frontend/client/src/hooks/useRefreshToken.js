import { axiosPublic } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    // Get setAuth from useAuth to update the global state
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            console.log("Attempting to refresh token..."); // Debug log
            // Make request to the backend refresh endpoint
            const response = await axiosPublic.get('/api/auth/refresh', {
                withCredentials: true // Crucial: sends the httpOnly cookie
            });

            // --- CRITICAL UPDATE ---
            // Update the global auth state with BOTH the new accessToken
            // AND the user object returned from the backend.
            setAuth(prev => {
                console.log("Updating auth state with refreshed data."); // Debug log
                // Ensure we merge correctly, preserving other potential auth properties
                return {
                    ...prev, // Keep any other existing auth properties
                    isLoggedIn: true, // Make sure isLoggedIn is true
                    accessToken: response.data.accessToken,
                    user: response.data.user // <-- THIS IS THE FIX
                };
            });

            // Return only the new access token for useAxiosPrivate
            return response.data;
            
        } catch (error) {
            console.error('Refresh token request failed:', error);
            // If refresh fails, clear the auth state completely
            setAuth({});
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            // Re-throw the error so components like PersistLogin know it failed
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;