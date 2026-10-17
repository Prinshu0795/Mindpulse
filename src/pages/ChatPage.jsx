import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ChatSection from '../components/ChatSection';

const ChatPage = () => {
    const { user, setIsAuthModalOpen } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="AI Wellness Companion | Empathetic Chat | MindPulse"
                description="Speak with MindPulse AI, a compassionate 24/7 mental wellness companion inspired by Wysa for private reflection, grounding exercises, and coping support."
                canonical="/chat"
            />

            {/* Calming glow accents */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={13} />
                            <span>Private & Safe Space</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                            AI Wellness Companion
                        </h1>
                        <p className="text-text-secondary text-xs sm:text-sm">
                            A calm, non-judgmental space to share what is on your mind. Available 24/7 in English and हिन्दी.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {user ? (
                            <Link 
                                to="/dashboard" 
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface text-text-primary text-xs font-semibold hover:border-accent hover:bg-bg transition-all"
                            >
                                <ArrowLeft size={14} />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all shadow-sm"
                            >
                                <span>Sign In to Save Progress</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Focused Chat Component */}
                <div className="pt-2">
                    <ChatSection />
                </div>

                {/* Privacy & Crisis Reassurance Note */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                        <span>100% Encrypted & Private</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <Sparkles size={16} className="text-accent shrink-0" />
                        <span>Powered by Empathetic Groq AI</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <Heart size={16} className="text-rose-500 shrink-0" />
                        <span>Non-Clinical Self-Care Tool</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatPage;
