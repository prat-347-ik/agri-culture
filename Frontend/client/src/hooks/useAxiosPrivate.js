import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // Interceptor to add the Authorization header to requests
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Interceptor to handle token expiration and retry the request
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                // If the error is 403 (Forbidden) and we haven't already retried
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // Mark as retried
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest); // Retry the original request
                }
                return Promise.reject(error);
            }
        );

        // Cleanup function to remove interceptors when the component unmounts
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };

    }, [auth, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;