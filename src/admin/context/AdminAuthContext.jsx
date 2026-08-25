import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext();

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api`;

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if admin is already logged in
    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('mindpulse_admin_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    // Token valid + user is admin — get profile
                    const profileRes = await fetch(`${API_URL}/user/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const profileData = await profileRes.json();
                    if (profileData.success) {
                        setAdmin(profileData.user);
                    }
                } else {
                    localStorage.removeItem('mindpulse_admin_token');
                    setAdmin(null);
                }
            } catch (err) {
                console.error('Admin verification error:', err);
                localStorage.removeItem('mindpulse_admin_token');
                setAdmin(null);
            }

            setLoading(false);
        };

        verifyAdmin();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);

            // Step 1: Authenticate via existing login
            const authRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const authData = await authRes.json();

            if (!authData.success) {
                setError(authData.message || 'Invalid credentials');
                return { success: false, message: authData.message };
            }

            // Step 2: Verify admin access
            const adminRes = await fetch(`${API_URL}/admin/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });

            if (adminRes.status === 403) {
                setError('Access denied. This account does not have admin privileges.');
                return { success: false, message: 'Access denied' };
            }

            if (!adminRes.ok) {
                setError('Failed to verify admin access.');
                return { success: false, message: 'Verification failed' };
            }

            // Admin verified
            localStorage.setItem('mindpulse_admin_token', authData.token);
            setAdmin(authData.user);
            return { success: true };
        } catch (err) {
            const msg = 'Could not connect to the server. Ensure the backend is running.';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const logout = useCallback(() => {
        setAdmin(null);
        localStorage.removeItem('mindpulse_admin_token');
    }, []);

    const getToken = useCallback(() => {
        return localStorage.getItem('mindpulse_admin_token');
    }, []);

    return (
        <AdminAuthContext.Provider value={{
            admin,
            loading,
            error,
            login,
            logout,
            getToken,
            API_URL
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
