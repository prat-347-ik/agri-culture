import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Create a regular instance for public routes
export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Create a private instance that will include credentials
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // This is crucial for sending the httpOnly cookie
});