import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {t('contact.title1')} <span className="text-accent">{t('contact.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info & FAQ Link */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface border border-border rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">{t('contact.getInTouch')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 text-accent rounded-xl">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary">{t('contact.email')}</p>
                                        <a href="mailto:prinshukumarguptap@gmail.com" className="text-text-secondary hover:text-accent transition-colors">
                                            prinshukumarguptap@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 text-accent rounded-xl">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary">{t('contact.phone')}</p>
                                        <a href="tel:6388626778" className="text-text-secondary hover:text-accent transition-colors">
                                            +91 6388626778
                                        </a>
                                        <p className="text-xs text-text-secondary mt-1">{t('contact.prioritySupport')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-bg border border-border rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                                <HelpCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t('contact.quickAnswers')}</h3>
                            <p className="text-text-secondary mb-6 text-sm">
                                {t('contact.quickDesc')}
                            </p>
                            <Link to="/faq" className="inline-block w-full py-3 px-4 border border-accent text-accent font-medium rounded-xl hover:bg-accent/10 transition-colors">
                                {t('contact.faqLink')}
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface border border-border rounded-2xl p-8 md:p-10">
                            <h2 className="text-2xl font-bold mb-8">{t('contact.sendMessage')}</h2>
                            
                            {status === 'success' && (
                                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                    {t('contact.successMsg')}
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                                    {t('contact.errorMsg', 'Failed to send message. Please try again.')}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">{t('contact.name')}</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-accent text-text-primary"
                                            placeholder={t('contact.namePlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">{t('contact.emailLabel')}</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-accent text-text-primary"
                                            placeholder={t('contact.emailPlaceholder')}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">{t('contact.subject')}</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-accent text-text-primary"
                                        placeholder={t('contact.subjectPlaceholder')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">{t('contact.message')}</label>
                                    <textarea 
                                        required
                                        rows="6"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-accent text-text-primary resize-none"
                                        placeholder={t('contact.messagePlaceholder')}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={status === 'sending'}
                                    className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {status === 'sending' ? t('contact.sending') : (
                                        <><Send size={18} /> {t('contact.sendBtn')}</>
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
