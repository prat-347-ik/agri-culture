import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { axiosPublic } from '../api/axios';

const useRefreshToken = () => {
    const { setAuth } = useContext(AuthContext);

    const refresh = async () => {
        const response = await axiosPublic.post('/api/auth/refresh', {}, {
            withCredentials: true // Send the httpOnly cookie
        });

        // Update the global auth state with the new access token
        setAuth(prev => {
            console.log('Previous Auth State:', prev);
            console.log('New Access Token:', response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken, isLoggedIn: true };
        });
        
        return response.data.accessToken;
    };
    return refresh;
};

export default useRefreshToken;