import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout, setIsAuthModalOpen } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Connect', href: '#connect' },
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Quest', href: '#quest' },
        { name: 'Wellness', href: '#wellness' },
        { name: 'Presence', href: '#presence' },
        { name: 'Experts', href: '#experts' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-sand/80 dark:bg-navy/80 backdrop-blur-lg border-b border-sage/10 dark:border-slate/10">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <a href="/" className="flex items-center gap-2 text-slate-800 dark:text-sage font-black text-xl md:text-2xl">
                    <div className="w-10 h-10 bg-sky rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky/20">M</div>
                    <span className="tracking-tighter">MindPulse</span>
                </a>

                {/* Desktop Links */}
                <div className="hidden lg:flex gap-6 xl:gap-8 text-sm font-bold text-slate-600 dark:text-sage/60 items-center">
                    <div className="flex items-center gap-2">
                        <a href="/" className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:opacity-80 transition-opacity">
                            <Home size={18} />
                            Home
                        </a>
                        <ThemeToggle />
                    </div>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 bg-sky/10 dark:bg-navy/30 px-4 py-2 rounded-full border border-sky/20 text-sky-700 dark:text-sky-400 hover:bg-sky/20 transition-all font-bold"
                            >
                                <User size={16} />
                                <span className="max-w-[80px] truncate">{user.name}</span>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate shadow-2xl rounded-2xl border border-sage/20 dark:border-slate/10 p-2 py-3 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-sage/5 mb-2">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Account</p>
                                            <p className="text-xs truncate font-bold text-slate-700 dark:text-sage">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-bold"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-slate-800 dark:bg-sky text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-black hover:scale-105 transition-all shadow-xl shadow-sky/10"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className="flex lg:hidden items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2.5 bg-sky/10 text-sky-600 rounded-xl border border-sky/20"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white/95 dark:bg-navy/95 backdrop-blur-xl border-b border-sage/10 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <a
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-4 bg-sky/10 text-sky-600 rounded-2xl font-black"
                            >
                                <Home size={20} /> Home
                            </a>
                            <div className="grid grid-cols-2 gap-3">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-4 bg-slate-50 dark:bg-slate/10 text-slate-600 dark:text-sage/70 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate/5"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-sage/5">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-4">
                                            <div className="w-10 h-10 bg-sky/20 text-sky-600 rounded-full flex items-center justify-center font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-sage">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black"
                                        >
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="w-full p-4 bg-slate-800 dark:bg-sky text-white dark:text-slate-900 rounded-2xl font-black shadow-lg"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
