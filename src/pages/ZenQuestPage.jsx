import React from 'react';
import { Sparkles, ArrowLeft, Heart, ShieldCheck, BarChart3, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ZenQuest from '../components/ZenQuest';

const ZenQuestPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="ZenQuest Grounding & Mindfulness Games | MindPulse"
                description="Practice tactile bubble popping, 5-4-3-2-1 sensory grounding, and the dissolving Worry Box on MindPulse to reset your nervous system."
                canonical="/zenquest"
            />

            {/* Ambient glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                            <Wind size={13} />
                            <span>Instant Nervous System Reset</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                            ZenQuest Grounding Activities
                        </h1>
                        <p className="text-text-secondary text-xs sm:text-sm">
                            Satisfying tactile relief, multi-sensory observation, and thought-releasing tools to restore inner peace.
                        </p>
                    </div>

                    {user && (
                        <Link 
                            to="/dashboard" 
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface text-text-primary text-xs font-semibold hover:border-accent hover:bg-bg transition-all self-start sm:self-auto"
                        >
                            <BarChart3 size={14} />
                            <span>Dashboard</span>
                        </Link>
                    )}
                </div>

                {/* ZenQuest Component */}
                <div className="pt-2">
                    <ZenQuest />
                </div>

                {/* Grounding Reassurance Badges */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <Sparkles size={16} className="text-accent shrink-0" />
                        <span>Somatic Tactile Calming</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <Wind size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>5-4-3-2-1 Sensory Grounding</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-surface border border-border/80 rounded-2xl">
                        <Heart size={16} className="text-rose-500 shrink-0" />
                        <span>Dissolving Worry Release</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ZenQuestPage;
