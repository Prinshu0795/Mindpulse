import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            
            if (data.success) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface rounded-xl p-8 max-w-md w-full shadow-xl border border-border"
            >
                <a href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-accent mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Login
                </a>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                        Reset Password
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                        {message}
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-bg focus:outline-none focus:border-accent text-text-primary transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors mt-6 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
