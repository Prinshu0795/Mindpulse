import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Menu, X, Globe, ChevronDown, ArrowRight 
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, setIsAuthModalOpen } = useAuth();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    // Active dropdown state: 'explore' | 'resources' | 'platform' | 'profile' | 'lang' | null
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState({ explore: true, resources: false, platform: false });

    const navRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    const handleMouseEnter = (name) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 180);
    };

    const handleDirectItemEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setActiveDropdown(null);
    };

    // Cleanup hover timer on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Close dropdowns when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setActiveDropdown(null);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Close menus on route change
    useEffect(() => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Hide navbar on auth reset pages
    if (location.pathname.startsWith('/reset-password') || location.pathname === '/forgot-password') {
        return null;
    }

    const toggleDropdown = (name) => {
        setActiveDropdown(prev => (prev === name ? null : name));
    };

    const toggleLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setActiveDropdown(null);
    };

    const toggleMobileSection = (section) => {
        setMobileExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Navigation Structure
    const exploreItems = [
        {
            title: 'AI Wellness Chat',
            desc: 'Real-time conversational empathy with voice mode',
            href: '/chat',
            badge: 'Live AI'
        },
        {
            title: 'Daily Check-in',
            desc: 'Track mood, stress triggers, sleep & energy levels',
            href: '/checkin',
            badge: 'Daily'
        },
        {
            title: 'ZenQuest Activities',
            desc: 'Sensory grounding, Worry Box & soothing games',
            href: '/zenquest'
        },
        {
            title: 'Standardized Screenings',
            desc: 'Validated mental health screening assessments (PHQ-9, PSS-10)',
            href: '/assessments'
        }
    ];

    const resourceItems = [
        {
            title: 'Wellness Library',
            desc: 'Guided routines, breathing exercises, calming nutrition',
            href: '/resources'
        },
        {
            title: 'MindPulse Journal',
            desc: 'Evidence-based articles and self-care strategies',
            href: '/blog'
        },
        {
            title: 'Verified Experts',
            desc: 'Connect with top mental health specialists across India',
            href: '/experts',
            badge: 'India-Wide'
        }
    ];

    const platformItems = [
        {
            title: 'About MindPulse',
            desc: 'Our mission, clinical approach, and philosophy',
            href: '/about'
        },
        {
            title: 'Frequently Asked',
            desc: 'Answers about security, data privacy & assessments',
            href: '/faq'
        },
        {
            title: 'Get in Touch',
            desc: '24/7 customer priority support and inquiry form',
            href: '/contact'
        }
    ];

    return (
        <nav 
            ref={navRef}
            className="fixed w-full top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border/80 transition-colors"
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                {/* Brand / Logo */}
                <div className="flex items-center gap-8">
                    <Link 
                        to={user ? "/dashboard" : "/"} 
                        onMouseEnter={handleDirectItemEnter}
                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-xl"
                        aria-label="MindPulse Home"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                            M
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight text-text-primary flex items-center gap-1.5">
                                MindPulse
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse inline-block"></span>
                            </span>
                            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest -mt-1">
                                Wellness
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        
                        {/* Explore Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => handleMouseEnter('explore')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                onClick={() => toggleDropdown('explore')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 group-hover:bg-accent/10 group-hover:text-accent ${
                                    activeDropdown === 'explore' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'explore'}
                                aria-haspopup="true"
                            >
                                <span>Explore</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 group-hover:rotate-180 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`absolute left-0 mt-3 w-80 bg-surface rounded-2xl border border-border shadow-wysa p-2.5 z-50 transition-all duration-200 ease-out before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] ${
                                    activeDropdown === 'explore' 
                                        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                                }`}
                            >
                                <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                    Interactive Wellness
                                </div>
                                <div className="space-y-0.5">
                                    {exploreItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.href}
                                            onClick={(e) => {
                                                if (item.action) {
                                                    e.preventDefault();
                                                    item.action();
                                                }
                                                setActiveDropdown(null);
                                            }}
                                            className="p-2.5 px-3 rounded-xl hover:bg-surface-subtle transition-colors group/item block"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-text-primary group-hover/item:text-accent transition-colors">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-text-secondary line-clamp-1 mt-0.5 font-normal">
                                                {item.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Assessments Direct Link */}
                        <NavLink
                            to="/assessments"
                            onMouseEnter={handleDirectItemEnter}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                    isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`
                            }
                        >
                            {t('navbar.assessments')}
                        </NavLink>

                        {/* Resources Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => handleMouseEnter('resources')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                onClick={() => toggleDropdown('resources')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 group-hover:bg-accent/10 group-hover:text-accent ${
                                    activeDropdown === 'resources' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'resources'}
                                aria-haspopup="true"
                            >
                                <span>{t('navbar.resources')}</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 group-hover:rotate-180 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`absolute left-0 mt-3 w-80 bg-surface rounded-2xl border border-border shadow-wysa p-2.5 z-50 transition-all duration-200 ease-out before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] ${
                                    activeDropdown === 'resources' 
                                        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                                }`}
                            >
                                <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                    Self-Care & Care Providers
                                </div>
                                <div className="space-y-0.5">
                                    {resourceItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.href}
                                            onClick={() => setActiveDropdown(null)}
                                            className="p-2.5 px-3 rounded-xl hover:bg-surface-subtle transition-colors group/item block"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-text-primary group-hover/item:text-accent transition-colors">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-text-secondary line-clamp-1 mt-0.5 font-normal">
                                                {item.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Platform / About Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => handleMouseEnter('platform')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                onClick={() => toggleDropdown('platform')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 group-hover:bg-accent/10 group-hover:text-accent ${
                                    activeDropdown === 'platform' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'platform'}
                                aria-haspopup="true"
                            >
                                <span>Platform</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 group-hover:rotate-180 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`absolute left-0 mt-3 w-80 bg-surface rounded-2xl border border-border shadow-wysa p-2.5 z-50 transition-all duration-200 ease-out before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] ${
                                    activeDropdown === 'platform' 
                                        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                                }`}
                            >
                                <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                    About MindPulse
                                </div>
                                <div className="space-y-0.5">
                                    {platformItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.href}
                                            onClick={() => setActiveDropdown(null)}
                                            className="p-2.5 px-3 rounded-xl hover:bg-surface-subtle transition-colors group/item block"
                                        >
                                            <span className="font-bold text-sm text-text-primary group-hover/item:text-accent transition-colors block">
                                                {item.title}
                                            </span>
                                            <p className="text-xs text-text-secondary line-clamp-1 mt-0.5 font-normal">
                                                {item.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Logged in direct dashboard link */}
                        {user && (
                            <NavLink
                                to="/dashboard"
                                onMouseEnter={handleDirectItemEnter}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                        isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                    }`
                                }
                            >
                                {t('navbar.dashboard')}
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2.5">
                    
                    {/* Language Switcher */}
                    <div 
                        className="relative group"
                        onMouseEnter={() => handleMouseEnter('lang')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            onClick={() => toggleDropdown('lang')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-subtle group-hover:bg-surface-subtle group-hover:text-text-primary font-semibold text-xs border border-border/80 transition-colors"
                            aria-label="Language selection"
                            aria-expanded={activeDropdown === 'lang'}
                        >
                            <Globe size={15} />
                            <span>{i18n.language === 'hi' ? 'हिन्दी' : 'EN'}</span>
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-36 bg-surface rounded-xl border border-border shadow-wysa p-1.5 z-50 transition-all duration-200 ease-out before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-[''] ${
                                activeDropdown === 'lang' 
                                    ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                            }`}
                        >
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                    i18n.language === 'en' ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface-subtle'
                                }`}
                            >
                                <span>English</span>
                                {i18n.language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>}
                            </button>
                            <button
                                onClick={() => toggleLanguage('hi')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                    i18n.language === 'hi' ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface-subtle'
                                }`}
                            >
                                <span>हिन्दी</span>
                                {i18n.language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>}
                            </button>
                        </div>
                    </div>

                    {/* User Authentication Actions */}
                    <div className="hidden sm:block">
                        {user ? (
                            <div 
                                className="relative group"
                                onMouseEnter={() => handleMouseEnter('profile')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    onClick={() => toggleDropdown('profile')}
                                    className="flex items-center gap-2.5 p-1.5 pr-3.5 bg-surface-subtle hover:bg-surface group-hover:bg-surface border border-border rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                                    aria-expanded={activeDropdown === 'profile'}
                                    aria-haspopup="true"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-text-primary max-w-[100px] truncate">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={`text-text-secondary transition-transform group-hover:rotate-180 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>

                                <div
                                    className={`absolute right-0 mt-3 w-64 bg-surface rounded-2xl border border-border shadow-wysa p-3 z-50 transition-all duration-200 ease-out before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] ${
                                        activeDropdown === 'profile' 
                                            ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                                            : 'opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                                    }`}
                                >
                                    <div className="px-3 py-2.5 border-b border-border mb-2">
                                        <p className="text-xs text-text-secondary uppercase tracking-wider font-bold">Logged In As</p>
                                        <p className="text-sm font-bold text-text-primary truncate mt-0.5">{user.name}</p>
                                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setActiveDropdown(null)}
                                            className="block px-3 py-2 rounded-xl text-sm font-medium text-text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
                                        >
                                            <span>{t('navbar.dashboard')}</span>
                                        </Link>
                                        <Link
                                            to="/dashboard/analysis"
                                            onClick={() => setActiveDropdown(null)}
                                            className="block px-3 py-2 rounded-xl text-sm font-medium text-text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
                                        >
                                            <span>Full Data Analysis</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setActiveDropdown(null);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-2 border-t border-border pt-2 cursor-pointer"
                                        >
                                            <span>{t('navbar.signOut')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2" onMouseEnter={handleDirectItemEnter}>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-4 py-2.5 text-sm font-semibold text-text-primary hover:text-accent transition-colors rounded-xl"
                                >
                                    {t('navbar.login')}
                                </button>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-hover rounded-full shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center gap-1.5"
                                >
                                    <span>{t('navbar.getStarted')}</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl bg-surface-subtle text-text-primary border border-border hover:bg-surface transition-colors"
                        aria-label="Toggle Mobile Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'calc(100vh - 5rem)' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden bg-surface border-b border-border overflow-y-auto"
                    >
                        <div className="p-5 space-y-4 max-w-md mx-auto pb-16">
                            
                            {/* User status card (Mobile) */}
                            {user && (
                                <div className="p-4 rounded-2xl bg-surface-subtle border border-border flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                                        aria-label="Sign Out"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Direct Action Links (Mobile) */}
                            {user && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3 bg-accent/10 text-accent font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
                                    >
                                        <BarChart3 size={15} /> Dashboard
                                    </Link>
                                    <Link
                                        to="/dashboard/analysis"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3 bg-surface-subtle text-text-primary font-bold text-xs rounded-xl text-center border border-border flex items-center justify-center gap-1.5"
                                    >
                                        <Activity size={15} /> Full Report
                                    </Link>
                                </div>
                            )}

                            {/* Accordion: Explore */}
                            <div className="rounded-2xl border border-border bg-surface-subtle overflow-hidden">
                                <button
                                    onClick={() => toggleMobileSection('explore')}
                                    className="w-full p-4 flex items-center justify-between font-bold text-sm text-text-primary"
                                >
                                    <span>Explore MindPulse</span>
                                    <ChevronDown size={16} className={`transition-transform ${mobileExpanded.explore ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded.explore && (
                                    <div className="p-3 pt-0 space-y-1 border-t border-border/50">
                                        {exploreItems.map(item => (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                onClick={(e) => {
                                                    if (item.action) {
                                                        e.preventDefault();
                                                        item.action();
                                                    }
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Direct: Assessments */}
                            <Link
                                to="/assessments"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full p-4 rounded-2xl border border-border bg-surface-subtle flex items-center justify-between font-bold text-sm text-text-primary hover:border-accent transition-colors"
                            >
                                <span>{t('navbar.assessments')}</span>
                                <ArrowRight size={16} className="text-text-secondary" />
                            </Link>

                            {/* Accordion: Resources */}
                            <div className="rounded-2xl border border-border bg-surface-subtle overflow-hidden">
                                <button
                                    onClick={() => toggleMobileSection('resources')}
                                    className="w-full p-4 flex items-center justify-between font-bold text-sm text-text-primary"
                                >
                                    <span>{t('navbar.resources')}</span>
                                    <ChevronDown size={16} className={`transition-transform ${mobileExpanded.resources ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded.resources && (
                                    <div className="p-3 pt-0 space-y-1 border-t border-border/50">
                                        {resourceItems.map(item => (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Accordion: Platform */}
                            <div className="rounded-2xl border border-border bg-surface-subtle overflow-hidden">
                                <button
                                    onClick={() => toggleMobileSection('platform')}
                                    className="w-full p-4 flex items-center justify-between font-bold text-sm text-text-primary"
                                >
                                    <span>Platform & Info</span>
                                    <ChevronDown size={16} className={`transition-transform ${mobileExpanded.platform ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded.platform && (
                                    <div className="p-3 pt-0 space-y-1 border-t border-border/50">
                                        {platformItems.map(item => (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Log In / Get Started on Mobile if not logged in */}
                            {!user && (
                                <div className="pt-4 space-y-2">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-full shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                                    >
                                        <span>{t('navbar.getStarted')}</span>
                                        <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="w-full py-3 bg-surface-subtle border border-border text-text-primary font-bold text-sm rounded-full"
                                    >
                                        {t('navbar.login')}
                                    </button>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
