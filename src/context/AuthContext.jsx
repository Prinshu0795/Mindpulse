import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('mindpulse_token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/user/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('mindpulse_token');
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, [API_URL]);

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('mindpulse_token', data.token);
                setIsAuthModalOpen(false);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, message: data.message };
            }
        } catch (err) {
            console.error('Registration API Error at:', `${API_URL}/auth/signup`, err);
            setError('Could not connect to authentication server. Please ensure the backend is running.');
            return { success: false, message: err.message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('mindpulse_token', data.token);
                setIsAuthModalOpen(false);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, message: data.message };
            }
        } catch (err) {
            console.error('Login API Error at:', `${API_URL}/auth/login`, err);
            setError('Could not connect to authentication server. Please ensure the backend is running.');
            return { success: false, message: err.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mindpulse_token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthModalOpen,
            setIsAuthModalOpen,
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
