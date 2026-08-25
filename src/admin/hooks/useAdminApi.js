import { useCallback } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * Custom hook for making authenticated admin API calls.
 * Automatically attaches the admin JWT token and handles common errors.
 */
export const useAdminApi = () => {
    const { getToken, logout, API_URL } = useAdminAuth();

    const apiCall = useCallback(async (endpoint, options = {}) => {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const { method = 'GET', body, params } = options;

        // Build URL with query params
        let url = `${API_URL}/admin${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            });
            const qs = searchParams.toString();
            if (qs) url += `?${qs}`;
        }

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        if (body && !(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        // Handle auth errors
        if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please login again.');
        }

        if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    }, [getToken, logout, API_URL]);

    return { apiCall };
};
