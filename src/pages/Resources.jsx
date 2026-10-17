import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Dumbbell, Activity, CheckCircle2, XCircle, Droplet, Moon, Brain, Coffee, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const categories = ['All', 'Stress Management', 'Anxiety Support', 'Sleep', 'Self-Care', 'Focus'];

const Resources = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('All');

    const exercises = [
        {
            title: "4-7-8 Breathing",
            category: "Stress Management",
            icon: <Wind className="text-teal-600 dark:text-teal-400" size={24} />,
            steps: ["Inhale through your nose gently for 4 seconds.", "Hold your breath calmly for 7 seconds.", "Exhale completely through your mouth for 8 seconds."],
        },
        {
            title: "Muscle Relaxation",
            category: "Anxiety Support",
            icon: <Dumbbell className="text-emerald-600 dark:text-emerald-400" size={24} />,
            steps: ["Tense your toes for 5 seconds.", "Release and feel the tension melt away.", "Repeat for each muscle group up to your neck."],
        },
        {
            title: "5-4-3-2-1 Grounding",
            category: "Anxiety Support",
            icon: <Activity className="text-amber-600 dark:text-amber-400" size={24} />,
            steps: ["Acknowledge 5 things you can see.", "Acknowledge 4 things you can touch.", "Acknowledge 3 things you can hear."],
        },
        {
            title: "Sleep Hygiene Routine",
            category: "Sleep",
            icon: <Moon className="text-indigo-600 dark:text-indigo-400" size={24} />,
            steps: ["Dim lights 1 hour before bedtime.", "Put away all screens and blue light.", "Read a physical book or listen to calming music."],
        },
        {
            title: "Pomodoro Focus",
            category: "Focus",
            icon: <Coffee className="text-orange-600 dark:text-orange-400" size={24} />,
            steps: ["Set a timer for 25 minutes of deep focus.", "Take a 5-minute break to stretch and drink water.", "After 4 cycles, take a longer 15-30 minute break."],
        },
        {
            title: "Daily Journaling",
            category: "Self-Care",
            icon: <Brain className="text-purple-600 dark:text-purple-400" size={24} />,
            steps: ["Write down 3 things you are grateful for.", "Document one major feeling from the day.", "Set one gentle intention for tomorrow."],
        }
    ];

    const filteredExercises = activeTab === 'All' ? exercises : exercises.filter(ex => ex.category === activeTab);

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="Mental Wellness Resources | Stress, Anxiety, Sleep & Self-Care"
                description="Explore practical mental wellness resources covering stress management, anxiety awareness, sleep hygiene, self-care, and healthy habits."
                canonical="/resources"
            />

            {/* Ambient glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto space-y-14">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>Self-Guided Wellness Library</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Wellness <span className="text-accent">{t('resources.title')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        {t('resources.subtitle')}
                    </p>
                    
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                                    activeTab === cat 
                                        ? 'bg-accent text-white border-accent shadow-sm' 
                                        : 'bg-surface text-text-secondary border-border hover:border-accent/40 hover:text-text-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Exercises Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExercises.map((ex, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={ex.title}
                            className="bg-surface p-6 sm:p-7 rounded-3xl border border-border flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        {ex.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-text-primary">{ex.title}</h4>
                                        <span className="text-xs text-text-secondary font-medium">{ex.category}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {ex.steps.map((step, si) => (
                                        <li key={si} className="flex gap-3 text-xs sm:text-sm text-text-secondary font-medium items-start leading-relaxed">
                                            <span className="w-5 h-5 bg-bg border border-border rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-text-primary mt-0.5">
                                                {si + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                                <span>Guided Exercise</span>
                                <span>3-5 min</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Diet/Self-Care Quick Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-6 sm:p-10 rounded-3xl border border-border shadow-sm">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                            {t('resources.eatForPeace')}
                        </h3>
                        <div className="space-y-2.5">
                            {["Oats & Complex Carbs", "Berries & Antioxidants", "Dark Chocolate (70%+)", "Herbal Chamomile Tea", "Yogurt & Probiotics"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-bg p-3.5 rounded-2xl border border-border/80">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="font-semibold text-text-primary text-xs sm:text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
                            <XCircle size={20} className="text-rose-500" />
                            {t('resources.avoidForCalm')}
                        </h3>
                        <div className="space-y-2.5">
                            {["Excess Caffeine", "Refined White Sugar", "Heavy Fried Foods", "Alcohol Before Bed"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-bg p-3.5 rounded-2xl border border-border/80">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="font-semibold text-text-primary text-xs sm:text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <div className="bg-bg border border-border p-6 rounded-2xl flex items-start sm:items-center gap-4 sm:gap-6 flex-col sm:flex-row">
                            <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                <Droplet size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">
                                    {t('resources.hydrationTitle')}
                                </span>
                                <p className="font-medium text-text-primary text-xs sm:text-sm leading-relaxed">
                                    {t('resources.hydrationDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Resources;
