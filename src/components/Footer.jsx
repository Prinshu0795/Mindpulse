import React from 'react';
import { ShieldCheck, Heart, Sparkles, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="pt-16 pb-12 border-t border-border bg-surface mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Emergency Hotline Notice (Wysa best practice) */}
                <div className="mb-12 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-text-primary">
                    <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-semibold text-center sm:text-left">
                        <PhoneCall size={16} className="shrink-0" />
                        <span>Need urgent emotional help? Call Tele-MANAS (14416) or Vandrevala Foundation (9999 666 555) for free 24/7 crisis support.</span>
                    </div>
                    <Link to="/contact" className="text-accent font-bold hover:underline shrink-0 text-xs">
                        Emergency Contacts &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                    
                    {/* Brand column */}
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5 text-text-primary font-extrabold text-2xl tracking-tight">
                            <div className="w-9 h-9 bg-accent text-white rounded-xl flex items-center justify-center shadow-md shadow-accent/20">
                                M
                            </div>
                            <span>Mind<span className="text-accent">Pulse</span></span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                            {t('footer.brandDesc')}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                            <ShieldCheck size={14} className="shrink-0" />
                            <span>{t('footer.encrypted')}</span>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">{t('footer.platform')}</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/assessments" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.assessments')}</Link></li>
                            <li><Link to="/resources" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.resources')}</Link></li>
                            <li><Link to="/blog" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.blog')}</Link></li>
                            <li><Link to="/experts" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.experts')}</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">{t('footer.company')}</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/about" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.about')}</Link></li>
                            <li><Link to="/contact" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('navbar.contact')}</Link></li>
                            <li><Link to="/faq" className="text-text-secondary hover:text-accent transition-colors font-medium">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">{t('footer.legal')}</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/privacy-policy" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('footer.privacy')}</Link></li>
                            <li><Link to="/terms-of-service" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('footer.terms')}</Link></li>
                            <li><Link to="/medical-disclaimer" className="text-text-secondary hover:text-accent transition-colors font-medium">{t('footer.disclaimer')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-5 text-xs text-text-secondary">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <p className="font-medium">
                            {t('footer.copyright')}
                        </p>
                        <span className="hidden sm:inline text-border">|</span>
                        <ThemeToggle />
                    </div>
                    <p className="max-w-xl text-center md:text-right leading-relaxed">
                        {t('footer.disclaimerText')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
