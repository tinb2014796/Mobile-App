// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Tạo context với giá trị mặc định
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Tạo provider cho context
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

