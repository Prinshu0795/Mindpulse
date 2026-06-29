import React, { useState } from 'react';
import { X, Mail, User, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login, register, error } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password);
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-surface rounded-xl p-8 max-w-md w-full shadow-xl border border-border overflow-hidden"
                >
                    <button
                        onClick={() => setIsAuthModalOpen(false)}
                        className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h3>
                        <p className="text-text-secondary text-sm">
                            {isLogin ? 'Join MindPulse to personalize your experience.' : 'Start your wellness journey today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label className="block text-sm font-medium mb-1.5 text-text-secondary">Your Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                                    <input
                                        required={!isLogin}
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-bg focus:outline-none focus:border-accent text-text-primary transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}
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
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Password</label>
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
                            {isLogin && (
                                <div className="text-right mt-2">
                                    <a href="/forgot-password" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-white py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors mt-6 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
