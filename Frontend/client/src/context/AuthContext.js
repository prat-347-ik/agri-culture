import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({}); // Start with an empty auth object

    // REMOVED the useEffect that was causing the issue.
    // PersistLogin now handles session verification.

    const login = (accessToken, user) => {
        setAuth({ isLoggedIn: true, accessToken, user });
        localStorage.setItem('isLoggedIn', 'true'); // Still use this for the ProtectedRoute check
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setAuth({}); // Clear the auth state
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;