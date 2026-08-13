import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Activity, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const moods = ['Very Happy', 'Happy', 'Neutral', 'Anxious', 'Stressed', 'Sad', 'Irritated'];
const triggersList = ['Academics / Exams', 'Career / Job', 'Family', 'Relationships', 'Financial', 'Health', 'Sleep', 'Social situations', 'Work', 'Other'];

const DailyCheckInModal = ({ onClose, onComplete }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
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

    const handleTriggerToggle = (t) => {
        setFormData(prev => {
            const tr = prev.stressTriggers;
            if (tr.includes(t)) {
                return { ...prev, stressTriggers: tr.filter(x => x !== t) };
            } else {
                return { ...prev, stressTriggers: [...tr, t] };
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
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden overflow-y-auto max-h-[90vh] border border-border"
            >
                {step < 4 && (
                    <div className="flex justify-between items-center p-4 border-b border-border">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <Activity size={18} className="text-accent" />
                            {t('checkin.title')}
                        </h3>
                        <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-text-primary mb-4">{t('checkin.q1')}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {moods.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setFormData({...formData, mood: m})}
                                            className={`p-3 rounded-lg text-sm font-medium transition-colors border ${formData.mood === m ? 'bg-accent/10 border-accent text-accent' : 'bg-bg border-border text-text-primary hover:border-accent/50'}`}
                                        >
                                            {t(`checkin.moods.${m}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                disabled={!formData.mood}
                                onClick={() => setStep(2)}
                                className="w-full py-3 bg-accent text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                            >
                                {t('common.next')}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold text-text-primary">{t('checkin.rateLevels')}</h4>
                            
                            {[
                                { label: t('checkin.stressLevel'), key: 'stressLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                { label: t('checkin.anxietyLevel'), key: 'anxietyLevel', minLabel: t('checkin.veryLow'), maxLabel: t('checkin.veryHigh') },
                                { label: t('checkin.energyLevel'), key: 'energyLevel', minLabel: t('checkin.exhausted'), maxLabel: t('checkin.energized') },
                                { label: t('checkin.sleepQuality'), key: 'sleepQuality', minLabel: t('checkin.poor'), maxLabel: t('checkin.excellent') }
                            ].map(item => (
                                <div key={item.key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-text-primary">{item.label}</label>
                                        <span className="text-sm font-bold text-accent">{formData[item.key]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={formData[item.key]}
                                        onChange={(e) => setFormData({...formData, [item.key]: parseInt(e.target.value)})}
                                        className="w-full accent-accent bg-border h-2 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                                        <span>{item.minLabel}</span>
                                        <span>{item.maxLabel}</span>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-bg border border-border text-text-primary rounded-xl font-medium">{t('common.back')}</button>
                                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-accent text-white rounded-xl font-medium">{t('common.next')}</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-text-primary mb-3">{t('checkin.triggersQ')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {triggersList.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleTriggerToggle(t)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${formData.stressTriggers.includes(t) ? 'bg-accent/10 border-accent text-accent' : 'bg-bg border-border text-text-secondary hover:text-text-primary'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-text-primary mb-2">{t('checkin.notesQ')}</h4>
                                <textarea
                                    className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-accent"
                                    rows="4"
                                    placeholder={t('checkin.notesPlaceholder')}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-bg border border-border text-text-primary rounded-xl font-medium">{t('common.back')}</button>
                                <button 
                                    onClick={submitCheckIn} 
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-accent text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? t('checkin.saving') : t('checkin.finish')}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">{t('checkin.complete')}</h3>
                            <p className="text-text-secondary mb-8">{t('checkin.updated')}</p>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-accent text-white rounded-xl font-medium transition-colors hover:bg-accent/90"
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
