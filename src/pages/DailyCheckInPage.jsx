import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, CheckCircle2, ChevronRight, ArrowLeft, 
    Sparkles, ShieldCheck, Calendar, MessageSquare, BarChart3, LogIn 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const moods = [
    { name: 'Very Happy', emoji: '😊' },
    { name: 'Happy', emoji: '🙂' },
    { name: 'Neutral', emoji: '😐' },
    { name: 'Anxious', emoji: '😰' },
    { name: 'Stressed', emoji: '😣' },
    { name: 'Sad', emoji: '😔' },
    { name: 'Irritated', emoji: '😤' }
];

const triggersList = [
    'Academics / Exams', 
    'Career / Job', 
    'Family', 
    'Relationships', 
    'Financial', 
    'Health', 
    'Sleep', 
    'Social situations', 
    'Work', 
    'Other'
];

const DailyCheckInPage = () => {
    const { t } = useTranslation();
    const { user, setIsAuthModalOpen } = useAuth();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        mood: '',
        stressLevel: 5,
        anxietyLevel: 5,
        energyLevel: 5,
        sleepQuality: 5,
        stressTriggers: [],
        notes: ''
    });

    const handleTriggerToggle = (trigger) => {
        setFormData(prev => {
            const tr = prev.stressTriggers;
            if (tr.includes(trigger)) {
                return { ...prev, stressTriggers: tr.filter(x => x !== trigger) };
            } else {
                return { ...prev, stressTriggers: [...tr, trigger] };
            }
        });
    };

    const submitCheckIn = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('mindpulse_token');
            const res = await fetch(`${API_URL}/assessments/checkins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setStep(4);
            } else {
                setError(data.message || 'Error submitting check-in');
            }
        } catch (err) {
            setError(err.message || 'Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="Daily Wellness Check-in | MindPulse"
                description="Log your daily mood, stress triggers, and sleep quality in under 30 seconds to track emotional patterns over time."
                canonical="/checkin"
            />

            {/* Ambient glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                            <Calendar size={13} />
                            <span>30-Second Practice</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                            Daily Wellness Check-in
                        </h1>
                        <p className="text-text-secondary text-xs sm:text-sm">
                            Capture your state of mind to cultivate daily self-awareness and track patterns over time.
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

                {!user ? (
                    <div className="bg-surface rounded-3xl p-8 sm:p-12 border border-border text-center space-y-6 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto shadow-sm">
                            <Activity size={32} />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-text-primary">
                                Track Your Everyday Peace
                            </h2>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Please sign in to log your daily check-in, build habit streaks, and generate personalized wellness analytics.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 active:scale-[0.98]"
                        >
                            <LogIn size={18} />
                            <span>Sign In to Continue</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
                        
                        {/* Progress Bar Header */}
                        {step < 4 && (
                            <div className="p-5 border-b border-border bg-surface/80">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent">
                                        Step {step} of 3
                                    </span>
                                    <span className="text-xs text-text-secondary font-medium">
                                        {step === 1 && "Current Feeling"}
                                        {step === 2 && "Physical & Mental Levels"}
                                        {step === 3 && "Triggers & Notes"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3].map((s) => (
                                        <div 
                                            key={s} 
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                step >= s ? 'bg-accent' : 'bg-border'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-6 sm:p-8">
                            {error && (
                                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-xs sm:text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            {/* Step 1: Mood */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-text-primary mb-1">
                                            {t('checkin.q1')}
                                        </h3>
                                        <p className="text-xs text-text-secondary mb-6">
                                            Select the emotional tone that best matches how you are feeling right now.
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {moods.map(m => {
                                                const isSelected = formData.mood === m.name;
                                                return (
                                                    <button
                                                        key={m.name}
                                                        type="button"
                                                        onClick={() => setFormData({...formData, mood: m.name})}
                                                        className={`p-4 rounded-2xl text-sm font-semibold transition-all duration-200 border flex flex-col items-center gap-2 ${
                                                            isSelected 
                                                                ? 'bg-accent/15 border-accent text-accent font-bold scale-[1.02] shadow-sm' 
                                                                : 'bg-bg border-border text-text-primary hover:border-accent/40'
                                                        }`}
                                                    >
                                                        <span className="text-3xl">{m.emoji}</span>
                                                        <span>{t(`checkin.moods.${m.name}`) || m.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        disabled={!formData.mood}
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold disabled:opacity-50 transition-all hover:bg-accent/90 shadow-md shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                                    >
                                        <span>Continue to Levels</span>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Levels */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-text-primary mb-1">
                                            {t('checkin.rateLevels')}
                                        </h3>
                                        <p className="text-xs text-text-secondary">
                                            Adjust the sliders from 1 to 10 for a clear snapshot of your day.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: t('checkin.stressLevel'), key: 'stressLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                            { label: t('checkin.anxietyLevel'), key: 'anxietyLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                            { label: t('checkin.energyLevel'), key: 'energyLevel', minLabel: t('checkin.exhausted'), maxLabel: t('checkin.energized') },
                                            { label: t('checkin.sleepQuality'), key: 'sleepQuality', minLabel: t('checkin.poor'), maxLabel: t('checkin.excellent') }
                                        ].map(item => (
                                            <div key={item.key} className="p-4 bg-bg border border-border/80 rounded-2xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">{item.label}</label>
                                                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-accent text-white">
                                                        {formData[item.key]}/10
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={formData[item.key]}
                                                    onChange={(e) => setFormData({...formData, [item.key]: parseInt(e.target.value)})}
                                                    className="w-full accent-accent bg-border h-2 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-[11px] text-text-secondary mt-1.5 font-medium">
                                                    <span>{item.minLabel}</span>
                                                    <span>{item.maxLabel}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => setStep(1)} 
                                            className="flex-1 py-3.5 bg-bg border border-border text-text-primary rounded-2xl font-bold hover:bg-surface transition-colors flex items-center justify-center gap-1.5 text-sm"
                                        >
                                            <ArrowLeft size={16} />
                                            <span>Back</span>
                                        </button>
                                        <button 
                                            onClick={() => setStep(3)} 
                                            className="flex-1 py-3.5 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-1.5 text-sm active:scale-[0.98]"
                                        >
                                            <span>Next: Triggers</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Triggers & Notes */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-text-primary mb-1">
                                            {t('checkin.triggersQ')}
                                        </h3>
                                        <p className="text-xs text-text-secondary mb-4">
                                            Select any areas that might be causing friction or stress today:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {triggersList.map(tItem => {
                                                const isSelected = formData.stressTriggers.includes(tItem);
                                                return (
                                                    <button
                                                        key={tItem}
                                                        type="button"
                                                        onClick={() => handleTriggerToggle(tItem)}
                                                        className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150 border ${
                                                            isSelected 
                                                                ? 'bg-accent/15 border-accent text-accent font-bold scale-[1.02]' 
                                                                : 'bg-bg border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
                                                        }`}
                                                    >
                                                        {tItem}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                                            {t('checkin.notesQ')}
                                        </h4>
                                        <textarea
                                            className="w-full bg-bg border border-border rounded-2xl p-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium leading-relaxed"
                                            rows="4"
                                            placeholder={t('checkin.notesPlaceholder')}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setStep(2)} 
                                            className="flex-1 py-3.5 bg-bg border border-border text-text-primary rounded-2xl font-bold hover:bg-surface transition-colors flex items-center justify-center gap-1.5 text-sm"
                                        >
                                            <ArrowLeft size={16} />
                                            <span>Back</span>
                                        </button>
                                        <button 
                                            onClick={submitCheckIn} 
                                            disabled={isSubmitting}
                                            className="flex-1 py-3.5 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-1.5 text-sm disabled:opacity-50 active:scale-[0.98]"
                                        >
                                            <Sparkles size={16} />
                                            <span>{isSubmitting ? t('checkin.saving') : t('checkin.finish')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Complete */}
                            {step === 4 && (
                                <div className="text-center py-6 space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                        <CheckCircle2 size={44} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl font-extrabold text-text-primary">
                                            {t('checkin.complete')}
                                        </h3>
                                        <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                                            {t('checkin.updated')} Your emotional baseline and trends have been saved to your personal dashboard.
                                        </p>
                                    </div>

                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <Link
                                            to="/dashboard"
                                            className="w-full sm:w-auto px-6 py-3.5 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 text-sm"
                                        >
                                            View Analytics Dashboard
                                        </Link>
                                        <Link
                                            to="/chat"
                                            className="w-full sm:w-auto px-6 py-3.5 bg-surface border border-border text-text-primary rounded-2xl font-semibold hover:border-accent hover:bg-bg transition-all text-sm flex items-center justify-center gap-1.5"
                                        >
                                            <MessageSquare size={16} className="text-accent" />
                                            <span>Talk with AI Companion</span>
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DailyCheckInPage;
