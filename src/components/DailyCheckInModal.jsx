import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity, X, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

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

const DailyCheckInModal = ({ onClose, onComplete }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
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
        if (!user) return;
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
                if (onComplete) onComplete(data.data);
            } else {
                setError(data.message || 'Error submitting check-in');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[92vh] border border-border"
            >
                {step < 4 && (
                    <div className="p-5 border-b border-border bg-surface/80 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary text-base">
                                        {t('checkin.title')}
                                    </h3>
                                    <p className="text-[11px] text-text-secondary">Track your inner balance</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg transition-colors"
                                aria-label={t('common.close')}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Step indicator progress bar */}
                        <div className="flex items-center gap-1.5 pt-1">
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

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Mood Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-text-primary mb-1">
                                    {t('checkin.q1')}
                                </h4>
                                <p className="text-xs text-text-secondary mb-5">
                                    Pick the feeling that best mirrors your current state.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {moods.map(m => {
                                        const isSelected = formData.mood === m.name;
                                        return (
                                            <button
                                                key={m.name}
                                                type="button"
                                                onClick={() => setFormData({...formData, mood: m.name})}
                                                className={`p-3.5 rounded-2xl text-sm font-medium transition-all duration-200 border flex flex-col items-center gap-1.5 ${
                                                    isSelected 
                                                        ? 'bg-accent/15 border-accent text-accent font-bold scale-[1.02] shadow-sm' 
                                                        : 'bg-bg border-border text-text-primary hover:border-accent/40'
                                                }`}
                                            >
                                                <span className="text-2xl">{m.emoji}</span>
                                                <span>{t(`checkin.moods.${m.name}`) || m.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                disabled={!formData.mood}
                                onClick={() => setStep(2)}
                                className="w-full py-3.5 bg-accent text-white rounded-2xl font-bold disabled:opacity-50 transition-all hover:bg-accent/90 shadow-md shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>{t('common.next')}</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Rate Levels (1-10) */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-text-primary mb-1">
                                    {t('checkin.rateLevels')}
                                </h4>
                                <p className="text-xs text-text-secondary">
                                    Rate from 1 to 10 for a clear snapshot of your day.
                                </p>
                            </div>
                            
                            <div className="space-y-5">
                                {[
                                    { label: t('checkin.stressLevel'), key: 'stressLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                    { label: t('checkin.anxietyLevel'), key: 'anxietyLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                    { label: t('checkin.energyLevel'), key: 'energyLevel', minLabel: t('checkin.exhausted'), maxLabel: t('checkin.energized') },
                                    { label: t('checkin.sleepQuality'), key: 'sleepQuality', minLabel: t('checkin.poor'), maxLabel: t('checkin.excellent') }
                                ].map(item => (
                                    <div key={item.key} className="p-3.5 bg-bg border border-border/80 rounded-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">{item.label}</label>
                                            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-accent text-white">
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
                                    className="flex-1 py-3 bg-bg border border-border text-text-primary rounded-xl font-semibold hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft size={16} />
                                    <span>{t('common.back')}</span>
                                </button>
                                <button 
                                    onClick={() => setStep(3)} 
                                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    <span>{t('common.next')}</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Stress Triggers & Notes */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-text-primary mb-2">
                                    {t('checkin.triggersQ')}
                                </h4>
                                <p className="text-xs text-text-secondary mb-3">Select any areas causing tension right now:</p>
                                <div className="flex flex-wrap gap-2">
                                    {triggersList.map(tItem => {
                                        const isSelected = formData.stressTriggers.includes(tItem);
                                        return (
                                            <button
                                                key={tItem}
                                                type="button"
                                                onClick={() => handleTriggerToggle(tItem)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
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
                                <h4 className="text-sm font-bold text-text-primary mb-1.5">
                                    {t('checkin.notesQ')}
                                </h4>
                                <textarea
                                    className="w-full bg-bg border border-border rounded-xl p-3.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium leading-relaxed"
                                    rows="3"
                                    placeholder={t('checkin.notesPlaceholder')}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="flex-1 py-3 bg-bg border border-border text-text-primary rounded-xl font-semibold hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft size={16} />
                                    <span>{t('common.back')}</span>
                                </button>
                                <button 
                                    onClick={submitCheckIn} 
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 shadow-md shadow-accent/20 flex items-center justify-center gap-1.5"
                                >
                                    <Sparkles size={16} />
                                    <span>{isSubmitting ? t('checkin.saving') : t('checkin.finish')}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Completion */}
                    {step === 4 && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                <CheckCircle2 size={42} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-text-primary mb-2">
                                {t('checkin.complete')}
                            </h3>
                            <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
                                {t('checkin.updated')}
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 bg-accent text-white rounded-2xl font-bold transition-all hover:bg-accent/90 shadow-md shadow-accent/20"
                            >
                                {t('checkin.backToDash')}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DailyCheckInModal;
