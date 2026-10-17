import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    User, LogOut, Menu, X, Globe, ChevronDown, 
    BrainCircuit, Activity, Sparkles, ClipboardCheck, 
    BookOpen, Newspaper, Users, HeartHandshake, 
    HelpCircle, MessageSquare, BarChart3, ArrowRight, ShieldCheck
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, setIsAuthModalOpen } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Active dropdown state: 'explore' | 'resources' | 'platform' | 'profile' | 'lang' | null
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState({ explore: true, resources: false, platform: false });

    const navRef = useRef(null);

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
            icon: BrainCircuit,
            href: '/chat',
            badge: 'Live AI'
        },
        {
            title: 'Daily Check-in',
            desc: 'Track mood, stress triggers, sleep & energy levels',
            icon: Activity,
            href: '/checkin',
            badge: 'Daily'
        },
        {
            title: 'ZenQuest Activities',
            desc: 'Sensory grounding, Worry Box & soothing games',
            icon: Sparkles,
            href: '/zenquest'
        },
        {
            title: 'Standardized Screenings',
            desc: 'Validated mental health screening assessments (PHQ-9, PSS-10)',
            icon: ClipboardCheck,
            href: '/assessments'
        }
    ];

    const resourceItems = [
        {
            title: 'Wellness Library',
            desc: 'Guided routines, breathing exercises, calming nutrition',
            icon: BookOpen,
            href: '/resources'
        },
        {
            title: 'MindPulse Journal',
            desc: 'Evidence-based articles and self-care strategies',
            icon: Newspaper,
            href: '/blog'
        },
        {
            title: 'Verified Experts',
            desc: 'Connect with top mental health specialists across India',
            icon: Users,
            href: '/experts',
            badge: 'India-Wide'
        }
    ];

    const platformItems = [
        {
            title: 'About MindPulse',
            desc: 'Our mission, clinical approach, and philosophy',
            icon: HeartHandshake,
            href: '/about'
        },
        {
            title: 'Frequently Asked',
            desc: 'Answers about security, data privacy & assessments',
            icon: HelpCircle,
            href: '/faq'
        },
        {
            title: 'Get in Touch',
            desc: '24/7 customer priority support and inquiry form',
            icon: MessageSquare,
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
                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-xl"
                        aria-label="MindPulse Home"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                            M
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight text-text-primary flex items-center gap-1.5">
                                MindPulse
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                            </span>
                            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest -mt-1">
                                Wellness
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        
                        {/* Explore Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('explore')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                                    activeDropdown === 'explore' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'explore'}
                                aria-haspopup="true"
                            >
                                <span>Explore</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'explore' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                        className="absolute left-0 mt-3 w-96 bg-surface rounded-2xl border border-border shadow-wysa p-3 z-50"
                                    >
                                        <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                            Interactive Wellness
                                        </div>
                                        <div className="space-y-1">
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
                                                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-surface-subtle transition-colors group"
                                                >
                                                    <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors">
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
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Assessments Direct Link */}
                        <NavLink
                            to="/assessments"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                    isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`
                            }
                        >
                            {t('navbar.assessments')}
                        </NavLink>

                        {/* Resources Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('resources')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                                    activeDropdown === 'resources' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'resources'}
                                aria-haspopup="true"
                            >
                                <span>{t('navbar.resources')}</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'resources' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                        className="absolute left-0 mt-3 w-96 bg-surface rounded-2xl border border-border shadow-wysa p-3 z-50"
                                    >
                                        <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                            Self-Care & Care Providers
                                        </div>
                                        <div className="space-y-1">
                                            {resourceItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    to={item.href}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-surface-subtle transition-colors group"
                                                >
                                                    <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors">
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
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Platform / About Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('platform')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                                    activeDropdown === 'platform' 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                                }`}
                                aria-expanded={activeDropdown === 'platform'}
                                aria-haspopup="true"
                            >
                                <span>Platform</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'platform' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                        className="absolute left-0 mt-3 w-88 bg-surface rounded-2xl border border-border shadow-wysa p-3 z-50"
                                    >
                                        <div className="text-[11px] font-bold text-text-secondary px-3 py-1.5 uppercase tracking-wider">
                                            About MindPulse
                                        </div>
                                        <div className="space-y-1">
                                            {platformItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    to={item.href}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-surface-subtle transition-colors group"
                                                >
                                                    <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors block">
                                                            {item.title}
                                                        </span>
                                                        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5 font-normal">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Logged in direct dashboard link */}
                        {user && (
                            <NavLink
                                to="/dashboard"
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
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('lang')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-subtle font-semibold text-xs border border-border/80 transition-colors"
                            aria-label="Language selection"
                            aria-expanded={activeDropdown === 'lang'}
                        >
                            <Globe size={15} />
                            <span>{i18n.language === 'hi' ? 'हिन्दी' : 'EN'}</span>
                        </button>

                        <AnimatePresence>
                            {activeDropdown === 'lang' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-36 bg-surface rounded-xl border border-border shadow-wysa p-1.5 z-50"
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Dark/Light Theme Toggle */}
                    <ThemeToggle />

                    {/* User Authentication Actions */}
                    <div className="hidden sm:block">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('profile')}
                                    className="flex items-center gap-2.5 p-1.5 pr-3.5 bg-surface-subtle hover:bg-surface border border-border rounded-full transition-all group focus:outline-none focus:ring-2 focus:ring-accent"
                                    aria-expanded={activeDropdown === 'profile'}
                                    aria-haspopup="true"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-text-primary max-w-[100px] truncate">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={`text-text-secondary transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === 'profile' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl border border-border shadow-wysa p-3 z-50"
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
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
                                                >
                                                    <BarChart3 size={16} className="text-accent" />
                                                    <span>{t('navbar.dashboard')}</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/analysis"
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
                                                >
                                                    <Activity size={16} className="text-emerald-500" />
                                                    <span>Full Data Analysis</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-2 border-t border-border pt-2"
                                                >
                                                    <LogOut size={16} />
                                                    <span>{t('navbar.signOut')}</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
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
                                    <span className="flex items-center gap-2">
                                        <BrainCircuit size={18} className="text-accent" /> Explore MindPulse
                                    </span>
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
                                                className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <item.icon size={16} className="text-accent" />
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
                                <span className="flex items-center gap-2">
                                    <ClipboardCheck size={18} className="text-emerald-500" />
                                    {t('navbar.assessments')}
                                </span>
                                <ArrowRight size={16} className="text-text-secondary" />
                            </Link>

                            {/* Accordion: Resources */}
                            <div className="rounded-2xl border border-border bg-surface-subtle overflow-hidden">
                                <button
                                    onClick={() => toggleMobileSection('resources')}
                                    className="w-full p-4 flex items-center justify-between font-bold text-sm text-text-primary"
                                >
                                    <span className="flex items-center gap-2">
                                        <BookOpen size={18} className="text-accent" /> {t('navbar.resources')}
                                    </span>
                                    <ChevronDown size={16} className={`transition-transform ${mobileExpanded.resources ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded.resources && (
                                    <div className="p-3 pt-0 space-y-1 border-t border-border/50">
                                        {resourceItems.map(item => (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <item.icon size={16} className="text-accent" />
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
                                    <span className="flex items-center gap-2">
                                        <HeartHandshake size={18} className="text-accent" /> Platform & Info
                                    </span>
                                    <ChevronDown size={16} className={`transition-transform ${mobileExpanded.platform ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded.platform && (
                                    <div className="p-3 pt-0 space-y-1 border-t border-border/50">
                                        {platformItems.map(item => (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                                            >
                                                <item.icon size={16} className="text-accent" />
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
