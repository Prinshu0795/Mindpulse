import React, { useState } from 'react';
import { Mail, Phone, Send, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus(null), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus(null), 5000);
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="Contact MindPulse | Mental Wellness Support"
                description="Contact MindPulse with questions, feedback, or support requests regarding your mental wellness journey."
                canonical="/contact"
            />

            {/* Ambient glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>Here To Support You</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        {t('contact.title1')} <span className="text-accent">{t('contact.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Direct info & FAQ Link */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface border border-border rounded-3xl p-7 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-text-primary">{t('contact.getInTouch')}</h3>
                            
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-sm">{t('contact.email')}</p>
                                        <a href="mailto:prinshukumarguptap@gmail.com" className="text-text-secondary hover:text-accent transition-colors text-xs sm:text-sm font-medium">
                                            prinshukumarguptap@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-sm">{t('contact.phone')}</p>
                                        <a href="tel:6388626778" className="text-text-secondary hover:text-accent transition-colors text-xs sm:text-sm font-medium">
                                            +91 6388626778
                                        </a>
                                        <p className="text-xs text-text-secondary mt-0.5">{t('contact.prioritySupport')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-border rounded-3xl p-7 text-center shadow-sm">
                            <div className="w-14 h-14 bg-bg border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent shadow-sm">
                                <HelpCircle size={26} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-1.5">{t('contact.quickAnswers')}</h3>
                            <p className="text-text-secondary mb-5 text-xs sm:text-sm leading-relaxed">
                                {t('contact.quickDesc')}
                            </p>
                            <Link 
                                to="/faq" 
                                className="inline-block w-full py-3 px-4 border border-border bg-bg text-text-primary font-bold rounded-2xl hover:border-accent hover:bg-surface transition-all text-sm"
                            >
                                {t('contact.faqLink')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface border border-border rounded-3xl p-7 sm:p-10 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
                                {t('contact.sendMessage')}
                            </h2>
                            
                            {status === 'success' && (
                                <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 size={18} />
                                    <span>{t('contact.successMsg')}</span>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mb-6 p-4 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-2xl text-sm font-semibold">
                                    {t('contact.errorMsg', 'Failed to send message. Please try again.')}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('contact.name')}</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm"
                                            placeholder={t('contact.namePlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('contact.emailLabel')}</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm"
                                            placeholder={t('contact.emailPlaceholder')}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('contact.subject')}</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm"
                                        placeholder={t('contact.subjectPlaceholder')}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('contact.message')}</label>
                                    <textarea 
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-text-primary text-sm resize-none"
                                        placeholder={t('contact.messagePlaceholder')}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={status === 'sending'}
                                    className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-accent/20 active:scale-[0.98]"
                                >
                                    {status === 'sending' ? t('contact.sending') : (
                                        <><Send size={18} /> <span>{t('contact.sendBtn')}</span></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
