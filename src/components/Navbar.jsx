import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { user, logout, setIsAuthModalOpen } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();

    // Do not show navbar on Auth reset pages
    if (location.pathname.startsWith('/reset-password') || location.pathname === '/forgot-password') {
        return null;
    }

    const publicLinks = [
        { name: t('navbar.home'), href: '/' },
        { name: t('navbar.about'), href: '/about' },
        { name: t('navbar.assessments'), href: '/assessments' },
        { name: t('navbar.resources'), href: '/resources' },
        { name: t('navbar.blog'), href: '/blog' },
        { name: t('navbar.experts'), href: '/experts' },
        { name: t('navbar.contact'), href: '/contact' }
    ];

    const authLinks = [
        { name: t('navbar.dashboard'), href: '/dashboard' },
        { name: t('navbar.resources'), href: '/resources' },
        { name: t('navbar.journal'), href: '/blog' },
        { name: t('navbar.experts'), href: '/experts' },
    ];

    const navLinks = user ? authLinks : publicLinks;

    const closeMenu = () => setIsMobileMenuOpen(false);

    const toggleLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-colors">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-text-primary font-bold text-xl" onClick={closeMenu}>
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black">M</div>
                    <span>MindPulse</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) => 
                                `font-medium transition-colors ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Right Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher Desktop */}
                    <div className="hidden lg:block relative">
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-2 py-2 transition-colors min-h-[44px]"
                            aria-label={t('navbar.language')}
                        >
                            <Globe size={18} />
                            <span>{i18n.language === 'hi' ? 'हिन्दी' : 'English'}</span>
                            <span className="text-xs">▾</span>
                        </button>

                        {isLangMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-surface shadow-lg rounded-xl border border-border py-2 z-50">
                                <button
                                    onClick={() => toggleLanguage('en')}
                                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-bg transition-colors ${i18n.language === 'en' ? 'text-accent' : 'text-text-primary'}`}
                                >
                                    {i18n.language === 'en' && '✓ '}English
                                </button>
                                <button
                                    onClick={() => toggleLanguage('hi')}
                                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-bg transition-colors ${i18n.language === 'hi' ? 'text-accent' : 'text-text-primary'}`}
                                >
                                    {i18n.language === 'hi' && '✓ '}हिन्दी
                                </button>
                            </div>
                        )}
                    </div>

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
                                            <p className="text-xs text-text-secondary uppercase tracking-wide font-semibold">{t('navbar.account')}</p>
                                            <p className="text-sm truncate font-medium text-text-primary mt-1">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-bg rounded-lg transition-colors font-medium min-h-[44px]"
                                        >
                                            <LogOut size={16} />
                                            {t('navbar.signOut')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="text-text-primary font-medium hover:text-accent transition-colors px-4 py-2 min-h-[44px]"
                                >
                                    {t('navbar.login')}
                                </button>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors min-h-[44px]"
                                >
                                    {t('navbar.getStarted')}
                                </button>
                            </div>
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
                <div className="lg:hidden bg-surface border-t border-border absolute w-full left-0 top-16 shadow-xl h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                onClick={closeMenu}
                                className={({ isActive }) => 
                                    `block p-4 rounded-xl font-medium border ${isActive ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-bg text-text-primary border-border'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* Mobile Language Switcher */}
                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
                                    closeMenu();
                                }}
                                className="w-full flex items-center gap-3 p-4 bg-bg rounded-xl font-medium border border-border text-text-primary"
                            >
                                <Globe size={18} />
                                {i18n.language === 'hi' ? '🌐 English' : '🌐 हिन्दी'}
                            </button>
                        </div>

                        <div className="pt-4 mt-2 border-t border-border pb-8">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl">
                                        <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-text-primary truncate">{user.name}</p>
                                            <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); closeMenu(); }}
                                        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-medium border border-red-100 dark:border-red-900/30 min-h-[44px]"
                                    >
                                        <LogOut size={18} /> {t('navbar.signOut')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setIsAuthModalOpen(true); closeMenu(); }}
                                    className="w-full p-4 bg-accent text-white rounded-xl font-medium min-h-[44px]"
                                >
                                    {t('navbar.getStarted')} / {t('navbar.login')}
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
