import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Home = () => {
    const { user, setIsAuthModalOpen } = useAuth();
    const { t } = useTranslation();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen bg-bg text-text-primary transition-colors duration-300">
            <SEO 
                title="MindPulse | Mental Wellness & Wellness Tracking Platform"
                description="MindPulse is a mental wellness platform for tracking stress, anxiety, mood, sleep and overall well-being through screening tools, daily check-ins, wellness resources and personalized insights."
                canonical="/"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "MindPulse",
                    "url": "https://mindpulseco.in/"
                }}
            />
            <header className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-6 max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-text-primary">
                        {t('home.title1')} <br /><span className="text-accent">{t('home.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg md:text-xl">
                        {t('home.subtitle')}
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-medium transition-colors hover:bg-accent/90 shadow-lg shadow-accent/20"
                    >
                        <Sparkles size={18} />
                        {t('home.cta')}
                    </button>
                </motion.div>
            </header>

            <main className="space-y-24 pb-24">
            </main>
        </div>
    );
};

export default Home;
