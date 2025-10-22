import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        // 1. Define the request interceptor
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // Attach the access token to the header if it doesn't exist already
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // 2. Define the response interceptor
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                // Check if the error was 403 (token expired) and we haven't retried yet
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // Mark as retried
                    try {
                        const newAccessToken = await refresh(); // Get new token
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest); // Retry the original request
                    } catch (refreshError) {
                        // If refresh fails, the user is truly logged out
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // 3. Cleanup function: Eject interceptors on unmount
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };

    // 4. CRITICAL: Re-run this effect every time 'auth' or 'refresh' changes
    }, [auth, refresh]); 

    return axiosPrivate;
};

export default useAxiosPrivate;