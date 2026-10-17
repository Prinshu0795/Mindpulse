import React, { useState } from 'react';
import { X, Mail, User, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AuthModal = () => {
    const { t } = useTranslation();
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
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="relative bg-surface rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl border border-border overflow-hidden"
                >
                    <button
                        onClick={() => setIsAuthModalOpen(false)}
                        className="absolute top-5 right-5 p-2 text-text-secondary hover:text-text-primary hover:bg-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="text-center mb-7">
                        <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-accent/20 font-black text-xl">
                            M
                        </div>
                        <h3 className="text-2xl font-extrabold text-text-primary mb-1">
                            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
                        </h3>
                        <p className="text-text-secondary text-xs sm:text-sm">
                            {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 text-red-500 text-xs sm:text-sm font-semibold border border-red-500/25">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-text-secondary">{t('auth.yourName')}</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                                    <input
                                        required={!isLogin}
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </motion.div>
                        )}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-text-secondary">{t('auth.emailAddress')}</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-text-secondary">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm transition-all"
                                />
                            </div>
                            {isLogin && (
                                <div className="text-right mt-2">
                                    <Link 
                                        to="/forgot-password" 
                                        onClick={() => setIsAuthModalOpen(false)}
                                        className="text-xs font-semibold text-accent hover:underline transition-colors"
                                    >
                                        {t('auth.forgotPassword')}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all mt-6 flex items-center justify-center gap-2 shadow-md shadow-accent/20 active:scale-[0.98] text-sm"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? t('auth.signIn') : t('auth.createAccount'))}
                        </button>
                    </form>

                    <div className="mt-6 text-center pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-accent transition-colors"
                        >
                            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
