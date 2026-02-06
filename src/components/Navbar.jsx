import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout, setIsAuthModalOpen } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-sand/50 dark:bg-navy/50 backdrop-blur-md border-b border-sage/10 dark:border-slate/10">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 dark:text-sage font-bold text-2xl">
                    <div className="w-10 h-10 bg-sky rounded-xl flex items-center justify-center text-white">M</div>
                    MindPulse
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-sage/60 items-center">
                    <a href="#connect" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Connect</a>
                    <a href="#dashboard" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Dashboard</a>
                    <a href="#quest" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Quest</a>
                    <a href="#wellness" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Wellness</a>
                    <a href="#presence" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Presence</a>
                    <a href="#experts" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Experts</a>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 bg-sky/20 dark:bg-navy/30 px-4 py-2 rounded-full border border-sky/30 text-sky-700 dark:text-sky-400"
                            >
                                <User size={16} />
                                <span className="max-w-[100px] truncate">{user.name}</span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate shadow-xl rounded-2xl border border-sage/20 dark:border-slate/10 p-2 py-3">
                                    <div className="px-4 py-2 border-b border-sage/10 mb-2">
                                        <p className="text-xs text-slate-400 uppercase font-bold">Account</p>
                                        <p className="text-sm truncate font-medium text-slate-700 dark:text-sage">{user.email || 'No Email'}</p>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-sky text-slate-800 px-6 py-2.5 rounded-full font-bold hover:bg-sky/80 transition-all shadow-lg shadow-sky/20"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
