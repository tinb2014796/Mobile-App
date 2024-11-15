// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create context with default value
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Create provider for context
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
