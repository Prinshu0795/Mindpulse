import React from 'react';
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
            alt: "Breathing Focus",
            bg: "bg-sky-50"
        },
        {
            title: "Muscle Relaxation",
            icon: <Dumbbell className="text-emerald-600" />,
            steps: [
                "Tense your toes for 5 seconds.",
                "Release and feel the tension melt away.",
                "Repeat for each muscle group up to your neck."
            ],
            alt: "Muscle Release",
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
            alt: "Sensory Awareness",
            bg: "bg-amber-50"
        }
    ];

    const diet = {
        calm: ["Oats", "Berries", "Dark Chocolate", "Herbal Tea", "Yogurt"],
        avoid: ["Caffeine", "White Sugar", "Fried Food", "Alcohol"]
    };

    return (
        <section id="wellness" className="px-4 bg-bg scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Wellness Hub
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Tools for Daily Balance</h2>
                </div>

                <div className="space-y-10 mb-16">
                    <h3 className="text-2xl font-bold text-text-primary mb-6">Guided Exercises</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((ex, i) => (
                            <div
                                key={i}
                                className="bg-surface p-6 rounded-xl border border-border flex flex-col h-full hover:border-accent/30 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-bg border border-border rounded-xl flex items-center justify-center shrink-0">
                                        {ex.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-text-primary">{ex.title}</h4>
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
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-6 md:p-10 rounded-xl border border-border">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-6">Eat for Peace</h3>
                        <div className="space-y-3">
                            {diet.calm.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-bg p-3.5 rounded-xl border border-border">
                                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                    <span className="font-medium text-text-primary text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-6">Avoid for Calm</h3>
                        <div className="space-y-3">
                            {diet.avoid.map((item, i) => (
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
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">Pro-Tip</span>
                                <p className="font-medium text-text-primary text-sm sm:text-base">
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
