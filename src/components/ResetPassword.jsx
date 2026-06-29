import React, { useState } from 'react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = ({ token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();
            
            if (data.success) {
                setSuccess(true);
                // Optionally redirect to login after a few seconds, or user can click the button
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                setError(data.message || 'Invalid or expired token.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-surface rounded-xl p-8 max-w-md w-full shadow-xl border border-border text-center"
                >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                        Password Reset Successful
                    </h3>
                    <p className="text-text-secondary text-sm mb-8">
                        Your password has been reset successfully. You will be redirected to the login page shortly.
                    </p>
                    <a href="/" className="inline-block w-full bg-accent text-white py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors">
                        Go to Login
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface rounded-xl p-8 max-w-md w-full shadow-xl border border-border"
            >
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                        Create New Password
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">New Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-bg focus:outline-none focus:border-accent text-text-primary transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Confirm Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input
                                required
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-bg focus:outline-none focus:border-accent text-text-primary transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors mt-6 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
