import React, { createContext, useState } from 'react';
import { axiosPublic } from '../api/axios'; // 1. Import axiosPublic

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    const login = (accessToken, user) => {
        setAuth({ isLoggedIn: true, accessToken, user });
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
    };

    // 2. Make the logout function async
    const logout = async () => {
        setAuth({}); // Clear the auth state immediately
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');

        try {
            // 3. Tell the backend to clear the httpOnly cookie
            await axiosPublic.post('/api/auth/logout');
        } catch (err) {
            console.error('Logout failed:', err);
            // Don't worry if it fails, user is logged out on frontend
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;