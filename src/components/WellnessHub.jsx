import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    Droplet,
    Wind,
    Dumbbell,
    Activity,
    Zap
} from 'lucide-react';

const WellnessHub = () => {
    const exercises = [
        {
            title: "4-7-8 Breathing",
            icon: <Wind className="text-sky-600" />,
            steps: [
                "Inhale through your nose for 4 seconds.",
                "Hold your breath for 7 seconds.",
                "Exhale completely through your mouth for 8 seconds."
            ],
            alt: "Illustration of person breathing deeply",
            bg: "bg-sky/5"
        },
        {
            title: "Muscle Relaxation",
            icon: <Dumbbell className="text-emerald-600" />,
            steps: [
                "Tense your toes for 5 seconds.",
                "Release and feel the tension melt away.",
                "Repeat for each muscle group up to your neck."
            ],
            alt: "Illustration of person relaxing muscles",
            bg: "bg-emerald-50"
        },
        {
            title: "5-4-3-2-1 Grounding",
            icon: <Activity className="text-amber-600" />,
            steps: [
                "Acknowledge 5 things you can see.",
                "Acknowledge 4 things you can touch.",
                "Acknowledge 3 things you can hear."
            ],
            alt: "Illustration of person grounding themselves",
            bg: "bg-amber-50"
        }
    ];

    const diet = {
        calm: ["Oats", "Berries", "Dark Chocolate", "Herbal Tea", "Yogurt"],
        avoid: ["Caffeine", "White Sugar", "Fried Food", "Alcohol"]
    };

    return (
        <section id="wellness" className="py-24 px-4 bg-white dark:bg-navy/5 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Wellness Hub
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-sage">Tools for <span className="text-emerald-600">Daily Balance</span></h2>
                </div>

                <div className="space-y-12 mb-24">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-sage mb-8">Guided Exercises</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {exercises.map((ex, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className={`${ex.bg} p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-navy/20 flex flex-col h-full`}
                            >
                                <div className="w-12 h-12 bg-white dark:bg-navy/40 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    {ex.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-800 dark:text-sage mb-4">{ex.title}</h4>

                                <div className="aspect-video bg-white/50 dark:bg-navy/20 rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-4 border border-slate-50">
                                    <div className="text-slate-300 dark:text-sage/20 text-center font-bold italic">
                                        <Zap size={32} className="mx-auto mb-2 opacity-20" />
                                        {ex.alt}
                                    </div>
                                </div>

                                <ul className="space-y-4 flex-grow">
                                    {ex.steps.map((step, si) => (
                                        <li key={si} className="flex gap-3 text-sm text-slate-600 dark:text-sage/60 font-medium">
                                            <span className="w-5 h-5 bg-white dark:bg-navy/40 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-slate-50">
                                                {si + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-sage/5 dark:bg-navy/20 p-8 md:p-12 rounded-[24px] border border-sage/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32" />

                    <div>
                        <h3 className="text-3xl font-black text-slate-800 dark:text-sage mb-8">Eat for Peace</h3>
                        <div className="space-y-4">
                            {diet.calm.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-navy/40 p-4 rounded-2xl border border-white/50">
                                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                                    <span className="font-bold text-slate-700 dark:text-sage">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-3xl font-black text-slate-800 dark:text-sage mb-8">Avoid for Calm</h3>
                        <div className="space-y-4">
                            {diet.avoid.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-navy/40 p-4 rounded-2xl border border-white/50">
                                    <XCircle size={24} className="text-rose-400 shrink-0" />
                                    <span className="font-bold text-slate-700 dark:text-sage">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-8">
                        <div className="bg-sky/10 border border-sky/20 p-6 rounded-2xl flex items-center gap-6">
                            <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                                <Droplet size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-1">Pro-Tip</span>
                                <p className="font-bold text-slate-800 dark:text-sage">
                                    Drinking a glass of water is the fastest way to start cooling down stress.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WellnessHub;
