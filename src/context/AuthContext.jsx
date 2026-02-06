import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('mindpulse_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('mindpulse_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mindpulse_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, setIsAuthModalOpen }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
