import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, ShieldCheck, Brain, Activity, Heart, CheckCircle2, 
    ArrowRight, Lock, Smile, Wind, HelpCircle, Clock, ChevronRight, 
    MousePointer2, MessageSquare, Calendar, TrendingUp, Award,
    ChevronDown, Star
} from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Home = () => {
    const { user, setIsAuthModalOpen } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Interactive sample states for homepage preview
    const [selectedMood, setSelectedMood] = useState('Calm');
    const [activeFaq, setActiveFaq] = useState(null);
    const [poppedBubbles, setPoppedBubbles] = useState([false, false, false, false, false, false, false, false]);

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const toggleBubble = (index) => {
        setPoppedBubbles(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const resetBubbles = () => {
        setPoppedBubbles([false, false, false, false, false, false, false, false]);
    };

    const assessmentsList = [
        {
            id: 'PSS-10',
            name: 'PSS-10',
            title: 'Perceived Stress Scale',
            measure: 'Perceived Stress & Control',
            questions: 10,
            time: '3-5 min',
            badge: 'Stress Baseline'
        },
        {
            id: 'GAD-7',
            name: 'GAD-7',
            title: 'Generalized Anxiety Disorder',
            measure: 'Anxiety Symptom Severity',
            questions: 7,
            time: '2-4 min',
            badge: 'Anxiety Screening'
        },
        {
            id: 'DASS-21',
            name: 'DASS-21',
            title: 'Depression Anxiety Stress Scale',
            measure: 'Multi-Axis Negative Affect',
            questions: 21,
            time: '5-10 min',
            badge: 'Comprehensive'
        },
        {
            id: 'PHQ-9',
            name: 'PHQ-9',
            title: 'Patient Health Questionnaire',
            measure: 'Depressive Mood Markers',
            questions: 9,
            time: '3-5 min',
            badge: 'Mood Tracking'
        },
        {
            id: 'WHO-5',
            name: 'WHO-5',
            title: 'Well-Being Index',
            measure: 'Overall Psychological Well-Being',
            questions: 5,
            time: '1-2 min',
            badge: 'Well-being'
        }
    ];

    const homeFaqs = [
        {
            q: "What makes MindPulse different from generic mood trackers?",
            a: "MindPulse combines daily check-ins with gold-standard clinical screening instruments (PSS-10, GAD-7, DASS-21, PHQ-9, WHO-5) and an empathetic Groq-powered AI companion. Longitudinal trends and stress trigger correlations help you understand the root causes of distress."
        },
        {
            q: "Is my personal wellness and check-in data private?",
            a: "Yes. Your mental health data is strictly private and encrypted. We do not sell or share your individual check-ins, journal entries, or assessment answers with third parties or advertisers."
        },
        {
            q: "How does the AI wellness companion work?",
            a: "MindPulse AI provides empathetic, soothing, real-time conversations in both English and Hindi. It subtly references your anonymized recent check-in mood and stress triggers to offer grounded coping techniques and compassionate reflection."
        },
        {
            q: "Can MindPulse replace professional medical evaluation?",
            a: "No. MindPulse is a self-care, psycho-educational, and wellness tracking platform. It is not a substitute for clinical diagnosis, psychiatric care, or emergency medical treatment. In crises, please consult healthcare providers or emergency helplines immediately."
        }
    ];

    return (
        <div className="min-h-screen bg-bg text-text-primary transition-colors duration-300 relative overflow-hidden">
            <SEO 
                title="MindPulse | Calm, Clinically-Inspired Everyday Mental Wellness"
                description="MindPulse is a personal mental wellness platform inspired by Wysa for tracking stress, anxiety, mood, and sleep through validated clinical screenings, empathetic AI support, and calming grounding exercises."
                canonical="/"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "MindPulse",
                    "url": "https://mindpulseco.in/"
                }}
            />

            {/* Decorative Calming Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute top-36 right-10 w-[30rem] h-[30rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl" />
            </div>

            {/* ========================================================= */}
            {/* SECTION A: TWO-COLUMN HERO SECTION (WYSA-INSPIRED)       */}
            {/* ========================================================= */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Headline, Trust Pill, Subtitle, Actions */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 text-center lg:text-left space-y-6"
                    >
                        {/* Wysa-style trust pill badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs md:text-sm font-semibold tracking-wide">
                            <Sparkles size={14} className="shrink-0 animate-pulse" />
                            <span>Clinically-Inspired Everyday Mental Wellness</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                            {t('home.title1')}{' '}
                            <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">
                                {t('home.title2')}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                            {t('home.subtitle')}
                        </p>

                        {/* Key Reassurance Badges */}
                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-text-secondary font-medium">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                                <span>100% Private & Encrypted</span>
                            </div>
                            <span className="text-border hidden sm:inline">•</span>
                            <div className="flex items-center gap-1.5">
                                <Activity size={16} className="text-accent shrink-0" />
                                <span>5 Validated Screenings</span>
                            </div>
                            <span className="text-border hidden sm:inline">•</span>
                            <div className="flex items-center gap-1.5">
                                <MessageSquare size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                <span>English & हिन्दी Support</span>
                            </div>
                        </div>

                        {/* Primary & Secondary Call to Actions */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-accent/90 shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98] text-base"
                            >
                                <Sparkles size={18} />
                                {t('home.cta')}
                            </button>

                            <Link
                                to="/assessments"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface text-text-primary border border-border px-7 py-4 rounded-2xl font-semibold transition-all hover:border-accent/40 hover:bg-bg shadow-sm text-base"
                            >
                                <Activity size={18} className="text-accent" />
                                Explore Screenings
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: Floating Interactive Wellness Card Showcase */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative mx-auto max-w-md bg-surface border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-accent/5 backdrop-blur-sm">
                            
                            {/* Card Top: Avatar & Compassionate Prompt */}
                            <div className="flex items-center justify-between pb-5 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-accent text-white flex items-center justify-center font-bold text-lg shadow-md shadow-accent/20">
                                        M
                                    </div>
                                    <div>
                                        <div className="font-bold text-text-primary text-sm sm:text-base flex items-center gap-1.5">
                                            MindPulse Companion
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <p className="text-xs text-text-secondary">Empathetic AI support • Ready to listen</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold text-[11px] uppercase tracking-wider">
                                    Safe Space
                                </span>
                            </div>

                            {/* Companion Dialog Bubble */}
                            <div className="mt-5 space-y-3">
                                <div className="bg-bg border border-border/70 p-4 rounded-2xl rounded-tl-sm text-sm text-text-primary leading-relaxed">
                                    "Take a gentle breath. How are you holding up today? You don't have to carry everything alone."
                                </div>

                                {/* Mood Quick Selector Pills */}
                                <div className="space-y-2 pt-1">
                                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Select your current state:
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { label: 'Calm', emoji: '🌿' },
                                            { label: 'Overwhelmed', emoji: '🌧️' },
                                            { label: 'Hopeful', emoji: '✨' },
                                            { label: 'Tired', emoji: '🌙' }
                                        ].map(mood => (
                                            <button
                                                key={mood.label}
                                                type="button"
                                                onClick={() => setSelectedMood(mood.label)}
                                                className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                                                    selectedMood === mood.label
                                                        ? 'bg-accent/15 border-accent text-accent font-bold scale-[1.02]'
                                                        : 'bg-bg border-border text-text-secondary hover:border-accent/40'
                                                }`}
                                            >
                                                <span>{mood.emoji}</span>
                                                <span className="truncate w-full text-center">{mood.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Micro Insight Snapshot */}
                            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-accent" />
                                    <span>Daily Check-in in 30s</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <TrendingUp size={14} />
                                    <span>Science-backed</span>
                                </div>
                            </div>

                            {/* Floating Floating Badge 1: 3-Day Grounding Streak */}
                            <motion.div 
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -bottom-5 -left-4 sm:-left-6 bg-surface border border-border/90 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5"
                            >
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                                    🔥
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-bold text-text-primary">3-Day Habit Streak</p>
                                    <p className="text-[10px] text-text-secondary">ZenQuest Garden Unlocked</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge 2: Clinical Screening */}
                            <motion.div 
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -top-4 -right-3 sm:-right-5 bg-surface border border-border/90 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2"
                            >
                                <Activity size={16} className="text-accent" />
                                <span className="text-[11px] font-bold text-text-primary">PHQ-9 & GAD-7 Validated</span>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION B: CORE CAPABILITIES BENTO GRID                   */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="px-3.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                        Everything You Need For Well-Being
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                        Built for Comfort, Backed by Science
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg">
                        MindPulse brings together empathetic conversational support, clinically standardized metrics, and self-regulation exercises into one unified, calm space.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Bento 1: Empathetic AI Companion */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                Empathetic AI Companion
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                Speak your mind freely 24/7. MindPulse AI uses compassion and gentle cognitive-behavioral reflections in both English and Hindi to help untangle difficult moments.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                            <span>Text & Voice Powered by Groq</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Bento 2: 30-Second Daily Check-in */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <Smile size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                30-Second Daily Check-in
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                Log your mood, perceived stress, anxiety levels, sleep quality, and lifestyle triggers in under half a minute. Build consistent self-awareness effortlessly.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                            <span>Habit Streaks & Triggers</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Bento 3: Standardized Screenings */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                5 Validated Screenings
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                Baseline and track your mental wellbeing using PSS-10, GAD-7, DASS-21, PHQ-9, and WHO-5 psychological instruments with private scoring.
                            </p>
                        </div>
                        <Link 
                            to="/assessments"
                            className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent hover:underline"
                        >
                            <span>Explore Clinical Scales</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Bento 4: ZenQuest & Grounding Games */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <Wind size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                ZenQuest Sensory Grounding
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                Defuse tactile anxiety with interactive bubble pop, 5-4-3-2-1 sensory grounding, and the dissolving Worry Box to bring your nervous system back to baseline.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                            <span>Interactive Calming Tools</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Bento 5: Longitudinal Analytics Engine */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                Longitudinal Insights Engine
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                Powered by Python statistical analytics, observe how sleep correlates with your stress, pinpoint recurring triggers, and review comprehensive trajectory reports.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                            <span>Data-Driven Self Understanding</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Bento 6: Verified Professional Support */}
                    <div className="bg-surface border border-border rounded-3xl p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2.5">
                                Top Mental Health Experts
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                When you need deeper personal care, connect directly with verified psychologists, counselors, and psychiatrists across India with direct booking channels.
                            </p>
                        </div>
                        <Link 
                            to="/experts" 
                            className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent hover:underline"
                        >
                            <span>Browse Professional Directory</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION C: HOW MINDPULSE WORKS (4-STEP PROCESS)          */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 bg-surface/50 border-y border-border/80">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="px-3.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                            Simple & Sustainable
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                            How MindPulse Works
                        </h2>
                        <p className="text-text-secondary text-base sm:text-lg">
                            A clear, pressure-free path to understanding your psychological patterns and building everyday emotional resilience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {[
                            {
                                step: '01',
                                title: t('about.steps.s1.title') || 'Assess',
                                desc: t('about.steps.s1.desc') || 'Take validated screenings to baseline your current stress, anxiety, or mood states.',
                                icon: <Activity className="text-indigo-500" size={24} />
                            },
                            {
                                step: '02',
                                title: t('about.steps.s2.title') || 'Track',
                                desc: t('about.steps.s2.desc') || 'Log quick daily check-ins to monitor mood, energy levels, and sleep quality.',
                                icon: <CheckCircle2 className="text-emerald-500" size={24} />
                            },
                            {
                                step: '03',
                                title: t('about.steps.s3.title') || 'Understand',
                                desc: t('about.steps.s3.desc') || 'View long-term trends and AI-driven insights to uncover key stress triggers.',
                                icon: <Brain className="text-amber-500" size={24} />
                            },
                            {
                                step: '04',
                                title: t('about.steps.s4.title') || 'Build Resilience',
                                desc: t('about.steps.s4.desc') || 'Practice guided grounding exercises and zen tools to cultivate lasting inner calm.',
                                icon: <Sparkles className="text-accent" size={24} />
                            }
                        ].map((item, i) => (
                            <div key={item.step} className="bg-surface border border-border rounded-2xl p-6 text-center relative group hover:border-accent/50 transition-all">
                                <div className="text-5xl font-black text-text-secondary/15 mb-3 select-none">
                                    {item.step}
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-bg border border-border mx-auto flex items-center justify-center mb-4 text-text-primary shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION D: CLINICAL ASSESSMENTS SHOWCASE                  */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-3">
                        <span className="px-3.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                            Gold Standard Scales
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                            Standardized Mental Wellness Screenings
                        </h2>
                        <p className="text-text-secondary text-base max-w-2xl">
                            Each assessment is based on peer-reviewed clinical research to help you gain objective awareness of your well-being.
                        </p>
                    </div>
                    <Link
                        to="/assessments"
                        className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline shrink-0"
                    >
                        View All Screenings <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessmentsList.map(item => (
                        <div 
                            key={item.id}
                            className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between hover:border-accent/50 transition-all duration-300 shadow-sm"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xl font-extrabold text-text-primary">{item.name}</span>
                                    <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                                        {item.badge}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-text-primary text-base mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-text-secondary mb-6">
                                    Measures: <span className="text-text-primary font-medium">{item.measure}</span>
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-bg rounded-xl border border-border text-xs text-text-secondary">
                                    <div className="flex items-center gap-1.5">
                                        <HelpCircle size={14} className="text-accent" />
                                        <span>{item.questions} Questions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-accent" />
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="w-full py-3 px-4 rounded-xl bg-bg border border-border hover:border-accent text-text-primary font-semibold text-sm transition-all hover:bg-surface flex items-center justify-center gap-2"
                            >
                                <span>Take Assessment</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION E: INTERACTIVE GROUNDING PREVIEW (WYSA VIBE)      */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 bg-surface/60 border-y border-border/80">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                        <span className="px-3.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                            Instant Stress Relief
                        </span>
                        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                            Experience Tactile Grounding Right Now
                        </h2>
                        <p className="text-text-secondary text-sm sm:text-base">
                            Tense or feeling jittery? Click these satisfying bubbles to redirect nervous energy and center your mind in seconds.
                        </p>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-8 max-w-xl mx-auto text-center shadow-lg shadow-accent/5">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                                <MousePointer2 size={18} className="text-accent" />
                                <span>ZenQuest Bubble Pop</span>
                            </div>
                            <button
                                onClick={resetBubbles}
                                className="text-xs text-accent font-semibold hover:underline"
                            >
                                Reset All
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto py-4">
                            {poppedBubbles.map((isPopped, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => toggleBubble(idx)}
                                    className={`w-14 h-14 rounded-full mx-auto transition-all duration-200 flex items-center justify-center font-bold text-xs ${
                                        isPopped
                                            ? 'bg-bg border border-border text-text-secondary/40 scale-90 shadow-inner'
                                            : 'bg-accent/15 border-2 border-accent text-accent hover:bg-accent/25 hover:scale-105 active:scale-95 shadow-md shadow-accent/10'
                                    }`}
                                    aria-label={`Calm bubble ${idx + 1}`}
                                >
                                    {isPopped ? '✓' : '•'}
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-text-secondary mt-6 font-medium">
                            Part of MindPulse's ZenQuest toolkit, including 5-4-3-2-1 Sensory grounding and the dissolving Worry Box.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION F: PRIVACY & TRUST (NO FAKE CLAIMS)               */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-surface border border-border rounded-3xl p-7 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                            <Lock size={22} />
                        </div>
                        <h3 className="font-bold text-text-primary text-base mb-2">Private & Confidential</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Your self-assessments, mood logs, and conversations are encrypted and never sold or shared.
                        </p>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-7 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
                            <Award size={22} />
                        </div>
                        <h3 className="font-bold text-text-primary text-base mb-2">Evidence-Based Framework</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Built upon validated clinical scales (PSS-10, GAD-7, DASS-21, PHQ-9, WHO-5) with standard scoring.
                        </p>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-7 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="font-bold text-text-primary text-base mb-2">Clear Medical Disclaimer</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Transparent self-care tracking that respects boundaries and directs acute distress to real professionals.
                        </p>
                    </div>

                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION G: FREQUENTLY ASKED QUESTIONS                     */}
            {/* ========================================================= */}
            <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12 space-y-3">
                    <span className="px-3.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                        Common Questions
                    </span>
                    <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {homeFaqs.map((faq, idx) => {
                        const isOpen = activeFaq === idx;
                        return (
                            <div 
                                key={idx}
                                className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200"
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-text-primary hover:text-accent transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-base sm:text-lg">{faq.q}</span>
                                    <ChevronDown 
                                        size={20} 
                                        className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'text-text-secondary'}`} 
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border/50">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <Link to="/faq" className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:underline">
                        <span>Read all frequently asked questions</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION H: BOTTOM CALL TO ACTION BANNER (WYSA STYLE)      */}
            {/* ========================================================= */}
            <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent to-teal-800 text-white p-8 sm:p-12 md:p-16 text-center shadow-xl shadow-accent/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                            <Sparkles size={14} />
                            <span>Start Your Daily Practice</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Take Your First Breath Towards Inner Peace
                        </h2>
                        <p className="text-white/85 text-base sm:text-lg leading-relaxed">
                            Join thousands who use MindPulse every day to check in with their feelings, reflect with AI, and track emotional resilience over time.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-accent px-8 py-4 rounded-2xl font-bold transition-all hover:bg-white/95 shadow-lg active:scale-[0.98] text-base"
                            >
                                <Sparkles size={18} />
                                {t('home.cta')}
                            </button>
                            <Link
                                to="/about"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-8 py-4 rounded-2xl font-semibold transition-all text-base"
                            >
                                <span>Learn More About Us</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
