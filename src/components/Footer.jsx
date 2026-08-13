import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="py-16 border-t border-border bg-surface mt-auto">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 text-text-primary font-bold text-xl">
                            <div className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center">M</div>
                            MindPulse
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            {t('footer.brandDesc')}
                        </p>
                        <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                            <span>{t('footer.encrypted')}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-text-primary mb-4">{t('footer.platform')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/assessments" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.assessments')}</Link></li>
                            <li><Link to="/resources" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.resources')}</Link></li>
                            <li><Link to="/blog" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.blog')}</Link></li>
                            <li><Link to="/experts" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.experts')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text-primary mb-4">{t('footer.company')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.about')}</Link></li>
                            <li><Link to="/contact" className="text-text-secondary hover:text-accent transition-colors">{t('navbar.contact')}</Link></li>
                            <li><Link to="/faq" className="text-text-secondary hover:text-accent transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text-primary mb-4">{t('footer.legal')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/privacy-policy" className="text-text-secondary hover:text-accent transition-colors">{t('footer.privacy')}</Link></li>
                            <li><Link to="/terms-of-service" className="text-text-secondary hover:text-accent transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link to="/medical-disclaimer" className="text-text-secondary hover:text-accent transition-colors">{t('footer.disclaimer')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text-secondary text-sm font-medium">
                        {t('footer.copyright')}
                    </p>
                    <p className="text-text-secondary text-xs max-w-xl text-center md:text-right">
                        {t('footer.disclaimerText')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
