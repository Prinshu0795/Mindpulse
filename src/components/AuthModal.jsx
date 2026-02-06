import React, { useState } from 'react';
import { X, Mail, User, Lock, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    if (!isAuthModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            login({ name, email });
        }
    };

    const handleGoogleLogin = () => {
        // Simulating Google Login
        login({ name: 'Google User', email: 'user@gmail.com' });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-slate rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden border border-sage/20 dark:border-slate/10"
                >
                    <button
                        onClick={() => setIsAuthModalOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-sage transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-slate dark:text-sage mb-2">Welcome Back</h3>
                        <p className="text-slate-500 dark:text-sage/60">Join MindPulse to personalize your experience.</p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-sage/30 dark:border-slate/10 py-3 rounded-xl mb-6 hover:bg-sage/10 transition-all font-medium text-slate-700 dark:text-sage"
                    >
                        <Chrome size={20} className="text-blue-500" />
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-sage/20"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate px-2 text-slate-400">Or use email</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-sage/70">Your Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/30 dark:border-slate/10 bg-sage/10 dark:bg-navy/30 focus:outline-none focus:ring-2 focus:ring-sky/50 text-slate-800 dark:text-sage"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-sage/70">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/30 dark:border-slate/10 bg-sage/10 dark:bg-navy/30 focus:outline-none focus:ring-2 focus:ring-sky/50 text-slate-800 dark:text-sage"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-sky text-slate-800 py-4 rounded-xl font-bold hover:bg-sky/80 transition-all mt-2 shadow-lg shadow-sky/20"
                        >
                            Sign In to MindPulse
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
