import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
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
        <nav className="sticky top-0 z-50 bg-surface border-b border-border transition-colors">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <a href="/" className="flex items-center gap-2 text-text-primary font-bold text-xl">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black">M</div>
                    <span>MindPulse</span>
                </a>

                {/* Desktop Links */}
                <div className="hidden lg:flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-text-secondary hover:text-text-primary font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {/* Desktop Auth */}
                    <div className="hidden lg:block">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 bg-bg px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface transition-colors font-medium min-h-[44px]"
                                >
                                    <User size={18} />
                                    <span className="max-w-[100px] truncate">{user.name}</span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-surface shadow-lg rounded-xl border border-border p-2 z-50">
                                        <div className="px-4 py-3 border-b border-border mb-2">
                                            <p className="text-xs text-text-secondary uppercase tracking-wide font-semibold">Account</p>
                                            <p className="text-sm truncate font-medium text-text-primary mt-1">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-bg rounded-lg transition-colors font-medium min-h-[44px]"
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
                                className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors min-h-[44px]"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 bg-surface text-text-primary rounded-lg border border-border flex items-center justify-center min-w-[44px] min-h-[44px]"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-surface border-t border-border">
                    <div className="p-4 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block p-4 bg-bg text-text-primary rounded-xl font-medium border border-border"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="pt-4 mt-4 border-t border-border">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl">
                                        <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{user.name}</p>
                                            <p className="text-xs text-text-secondary">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-medium border border-red-100 dark:border-red-900/30 min-h-[44px]"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                    className="w-full p-4 bg-accent text-white rounded-xl font-medium min-h-[44px]"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
