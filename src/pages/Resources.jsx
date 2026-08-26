import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Dumbbell, Activity, CheckCircle2, XCircle, Droplet, Moon, Brain, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import resourceBgImage from '../assets/Resources.jpg';

const categories = ['All', 'Stress Management', 'Anxiety Support', 'Sleep', 'Self-Care', 'Focus'];

const Resources = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('All');

    const exercises = [
        {
            title: "4-7-8 Breathing",
            category: "Stress Management",
            icon: <Wind className="text-sky-600" />,
            steps: ["Inhale through your nose for 4 seconds.", "Hold your breath for 7 seconds.", "Exhale completely through your mouth for 8 seconds."],
        },
        {
            title: "Muscle Relaxation",
            category: "Anxiety Support",
            icon: <Dumbbell className="text-emerald-600" />,
            steps: ["Tense your toes for 5 seconds.", "Release and feel the tension melt away.", "Repeat for each muscle group up to your neck."],
        },
        {
            title: "5-4-3-2-1 Grounding",
            category: "Anxiety Support",
            icon: <Activity className="text-amber-600" />,
            steps: ["Acknowledge 5 things you can see.", "Acknowledge 4 things you can touch.", "Acknowledge 3 things you can hear."],
        },
        {
            title: "Sleep Hygiene Routine",
            category: "Sleep",
            icon: <Moon className="text-indigo-600" />,
            steps: ["Dim lights 1 hour before bed.", "Put away all screens and blue light.", "Read a physical book or listen to calming music."],
        },
        {
            title: "Pomodoro Focus",
            category: "Focus",
            icon: <Coffee className="text-orange-600" />,
            steps: ["Set a timer for 25 minutes of deep work.", "Take a 5-minute break to stretch.", "After 4 cycles, take a longer 15-30 minute break."],
        },
        {
            title: "Daily Journaling",
            category: "Self-Care",
            icon: <Brain className="text-pink-600" />,
            steps: ["Write down 3 things you are grateful for.", "Document one major feeling from the day.", "Set one small intention for tomorrow."],
        }
    ];

    const filteredExercises = activeTab === 'All' ? exercises : exercises.filter(ex => ex.category === activeTab);

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4 relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${resourceBgImage})`, backgroundAttachment: 'fixed' }}
                ></div>
                {/* Semi-transparent overlay to ensure text readability */}
                <div className="absolute inset-0 bg-bg/50 dark:bg-bg/70"></div>
            </div>

            <div className="relative z-10">
                <SEO 
                    title="Mental Wellness Resources | Stress, Anxiety, Sleep & Self-Care"
                    description="Explore practical mental wellness resources covering stress management, anxiety awareness, sleep, self-care, mindfulness and healthy habits."
                    canonical="/resources"
                />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 relative drop-shadow-md">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 drop-shadow-lg">
                        Wellness <span className="text-accent">{t('resources.title')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg mb-10">
                        {t('resources.subtitle')}
                    </p>
                    
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeTab === cat 
                                        ? 'bg-accent text-white border-accent' 
                                        : 'bg-surface text-text-secondary border-border hover:border-accent hover:text-text-primary'
                                } border`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredExercises.map((ex, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={ex.title}
                            className="bg-surface p-6 rounded-2xl border border-border flex flex-col h-full hover:border-accent/30 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-bg border border-border rounded-xl flex items-center justify-center shrink-0">
                                    {ex.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-text-primary">{ex.title}</h4>
                                    <span className="text-xs text-text-secondary font-medium">{ex.category}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 flex-grow">
                                {ex.steps.map((step, si) => (
                                    <li key={si} className="flex gap-3 text-sm text-text-secondary font-medium items-start">
                                        <span className="w-5 h-5 bg-bg border border-border rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-text-primary mt-0.5">
                                            {si + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Diet/Self-Care Quick Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-6 md:p-10 rounded-2xl border border-border">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-6">{t('resources.eatForPeace')}</h3>
                        <div className="space-y-3">
                            {["Oats", "Berries", "Dark Chocolate", "Herbal Tea", "Yogurt"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-bg p-3.5 rounded-xl border border-border">
                                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                    <span className="font-medium text-text-primary text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-6">{t('resources.avoidForCalm')}</h3>
                        <div className="space-y-3">
                            {["Caffeine", "White Sugar", "Fried Food", "Alcohol"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-bg p-3.5 rounded-xl border border-border">
                                    <XCircle size={20} className="text-rose-500 shrink-0" />
                                    <span className="font-medium text-text-primary text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <div className="bg-bg border border-border p-5 rounded-xl flex items-start sm:items-center gap-4 sm:gap-6 flex-col sm:flex-row">
                            <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center shrink-0">
                                <Droplet size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">{t('resources.hydrationTitle')}</span>
                                <p className="font-medium text-text-primary text-sm sm:text-base">
                                    {t('resources.hydrationDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Resources;
