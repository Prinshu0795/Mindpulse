import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Brain,
    ChevronRight,
    ChevronLeft,
    Activity,
    Info,
    History,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';

// PSS-10 Questions
const pssQuestions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and 'stressed'?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
];

// GAD-7 Questions
const gadQuestions = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
];

const StressDashboard = () => {
    const [history, setHistory] = useState([]);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [checkInStep, setCheckInStep] = useState(0); // 0: Start, 1: Questions, 2: Complete
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [activeType, setActiveType] = useState('PSS-10'); // 'PSS-10' or 'GAD-7'
    const [answers, setAnswers] = useState([]);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mindpulse_stats');
        if (saved) {
            setHistory(JSON.parse(saved));
        } else {
            // Mock data for first time users
            const mockData = [
                { date: 'Mon', stress: 18, anxiety: 8, trigger: 'Work' },
                { date: 'Tue', stress: 22, anxiety: 12, trigger: 'Social' },
                { date: 'Wed', stress: 15, anxiety: 7, trigger: 'Work' },
                { date: 'Thu', stress: 25, anxiety: 15, trigger: 'Family' },
                { date: 'Fri', stress: 12, anxiety: 6, trigger: 'Health' },
                { date: 'Sat', stress: 10, anxiety: 4, trigger: 'Rest' },
                { date: 'Sun', stress: 14, anxiety: 5, trigger: 'Rest' },
            ];
            setHistory(mockData);
        }
    }, []);

    const saveStats = (score, type) => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        const newEntry = {
            date: today,
            stress: type === 'PSS-10' ? score : (history[history.length - 1]?.stress || 15),
            anxiety: type === 'GAD-7' ? score : (history[history.length - 1]?.anxiety || 7),
            fullDate: new Date().toISOString()
        };

        const updatedHistory = [...history.slice(-6), newEntry];
        setHistory(updatedHistory);
        localStorage.setItem('mindpulse_stats', JSON.stringify(updatedHistory));
    };

    const handleAnswer = (val) => {
        const questions = activeType === 'PSS-10' ? pssQuestions : gadQuestions;
        const newAnswers = [...answers, val];
        setAnswers(newAnswers);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            // Calculate Score
            let score = 0;
            if (activeType === 'PSS-10') {
                // PSS-10 Scoring: Questions 4, 5, 7, 8 are reverse scored
                newAnswers.forEach((ans, idx) => {
                    if ([3, 4, 6, 7].includes(idx)) {
                        score += (4 - ans);
                    } else {
                        score += ans;
                    }
                });
            } else {
                score = newAnswers.reduce((a, b) => a + b, 0);
            }

            saveStats(score, activeType);
            setCheckInStep(2); // Complete
        }
    };

    const resetCheckIn = () => {
        setIsCheckInOpen(false);
        setCheckInStep(0);
        setCurrentQuestionIdx(0);
        setAnswers([]);
    };

    // Gauge Data Helper
    const currentLevel = history[history.length - 1] || { stress: 0, anxiety: 0 };
    const getStressInfo = (score) => {
        if (score <= 13) return { label: 'Low', color: '#82ca9d' };
        if (score <= 26) return { label: 'Moderate', color: '#ffc658' };
        return { label: 'High', color: '#ff7c7c' };
    };

    const getAnxietyInfo = (score) => {
        if (score <= 4) return { label: 'Minimal', color: '#82ca9d' };
        if (score <= 9) return { label: 'Mild', color: '#82ca9d' };
        if (score <= 14) return { label: 'Moderate', color: '#ffc658' };
        return { label: 'Severe', color: '#ff7c7c' };
    };

    const gaugeData = [
        { name: 'Level', value: currentLevel.stress, fill: getStressInfo(currentLevel.stress).color },
        { name: 'Remaining', value: 40 - currentLevel.stress, fill: '#f1f1f1' }
    ];

    return (
        <section id="dashboard" className="py-24 px-4 bg-sand/30 dark:bg-navy/20 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-sage mb-2">Well-being Dashboard</h2>
                        <p className="text-slate-500 dark:text-sage/60 font-medium">Track your inner balance and daily progress.</p>
                    </div>
                    <button
                        onClick={() => setIsCheckInOpen(true)}
                        className="group flex items-center gap-3 bg-sky text-slate-800 px-8 py-4 rounded-3xl font-bold shadow-xl shadow-sky/20 hover:scale-105 transition-all"
                    >
                        <Activity className="group-hover:animate-pulse" size={20} />
                        Daily Check-in
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Mood Wave Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white dark:bg-slate rounded-[3rem] p-8 shadow-2xl shadow-sage/5 border border-sage/10 dark:border-slate/10"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-700 dark:text-sage flex items-center gap-2">
                                <History className="text-sky-500" size={20} />
                                Mood Wave (Last 7 Days)
                            </h3>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky" /> Stress</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sage" /> Anxiety</span>
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#81a89a" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#81a89a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="stress"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorStress)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="anxiety"
                                        stroke="#81a89a"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAnxiety)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Anxiety Meter Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate rounded-[3rem] p-8 shadow-2xl shadow-sage/5 border border-sage/10 dark:border-slate/10 flex flex-col items-center justify-center text-center"
                    >
                        <h3 className="text-xl font-bold text-slate-700 dark:text-sage mb-6 flex items-center gap-2 self-start">
                            <AlertTriangle className="text-amber-500" size={20} />
                            Current Balance
                        </h3>

                        <div className="relative w-full h-48 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        cx="50%"
                                        cy="80%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {gaugeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-[60%] text-center">
                                <span className="text-4xl font-black text-slate-800 dark:text-sage">{currentLevel.stress}</span>
                                <p className="text-xs font-black uppercase text-slate-400 tracking-widest -mt-1">Pts</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-sage/5 dark:bg-navy/30 rounded-2xl w-full">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-slate-500 dark:text-sage/60">Stress Level</span>
                                <span className="text-sm font-black text-sky-600">{getStressInfo(currentLevel.stress).label}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-500 dark:text-sage/60">Anxiety Level</span>
                                <span className="text-sm font-black text-emerald-600">{getAnxietyInfo(currentLevel.anxiety).label}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Trigger Analysis Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate rounded-[3rem] p-8 shadow-2xl shadow-sage/5 border border-sage/10 dark:border-slate/10"
                    >
                        <h3 className="text-xl font-bold text-slate-700 dark:text-sage mb-6 flex items-center gap-2">
                            <BarChart3 className="text-emerald-500" size={20} />
                            Stress Triggers
                        </h3>
                        <div className="space-y-4">
                            {['Work', 'Health', 'Family', 'Social', 'Money'].map((trigger, idx) => {
                                const count = history.filter(h => h.trigger === trigger).length;
                                return (
                                    <div key={trigger} className="flex items-center gap-4">
                                        <span className="w-16 text-xs font-bold text-slate-400">{trigger}</span>
                                        <div className="grow h-3 bg-sage/10 dark:bg-navy/30 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(count / 7) * 100}%` }}
                                                className="h-full bg-sky-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-sky/40 dark:bg-sky/10 rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between items-start"
                    >
                        <div className="p-4 bg-white dark:bg-slate rounded-3xl shadow-lg mb-6 text-sky-600">
                            <Info size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-sage mb-2">Did you know?</h3>
                            <p className="text-slate-600 dark:text-sage/60 font-medium leading-relaxed mb-6 italic">
                                "Deep rhythmic breathing for just 5 minutes can lower your cortisol (stress hormone) levels by up to 20%."
                            </p>
                            <button
                                onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-6 py-3 bg-white text-sky-600 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-transform"
                            >
                                Try Breathing Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Daily Check-in Modal */}
            <AnimatePresence>
                {isCheckInOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetCheckIn}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
                        >
                            {checkInStep === 0 && (
                                <div className="p-10 text-center">
                                    <div className="w-20 h-20 bg-sky/20 rounded-3xl flex items-center justify-center text-sky-600 mx-auto mb-6">
                                        <Activity size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 dark:text-sage mb-4">Mind Check-in</h3>
                                    <p className="text-slate-500 dark:text-sage/60 mb-8 font-medium">Which metric would you like to track today?</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => { setActiveType('PSS-10'); setCheckInStep(1); }}
                                            className="group flex items-center justify-between p-6 bg-sage/5 hover:bg-sky hover:text-white transition-all rounded-3xl text-left border border-sage/10"
                                        >
                                            <div>
                                                <h4 className="font-black text-lg">Stress Level (PSS-10)</h4>
                                                <p className="text-xs group-hover:text-white/80 font-medium">10 questions • 2 mins</p>
                                            </div>
                                            <ChevronRight />
                                        </button>
                                        <button
                                            onClick={() => { setActiveType('GAD-7'); setCheckInStep(1); }}
                                            className="group flex items-center justify-between p-6 bg-sage/5 hover:bg-emerald-500 hover:text-white transition-all rounded-3xl text-left border border-sage/10"
                                        >
                                            <div>
                                                <h4 className="font-black text-lg">Anxiety Level (GAD-7)</h4>
                                                <p className="text-xs group-hover:text-white/80 font-medium">7 questions • 1 min</p>
                                            </div>
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {checkInStep === 1 && (
                                <div className="p-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <span className="px-3 py-1 bg-sky/10 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {activeType}
                                        </span>
                                        <span className="text-sm font-bold text-slate-400">
                                            {currentQuestionIdx + 1} of {activeType === 'PSS-10' ? pssQuestions.length : gadQuestions.length}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-sage mb-10 leading-snug">
                                        {activeType === 'PSS-10' ? pssQuestions[currentQuestionIdx] : gadQuestions[currentQuestionIdx]}
                                    </h3>

                                    <div className="space-y-3">
                                        {activeType === 'PSS-10' ? (
                                            ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'].map((label, i) => (
                                                <button
                                                    key={label}
                                                    onClick={() => handleAnswer(i)}
                                                    className="w-full p-4 rounded-2xl bg-sage/5 dark:bg-navy/30 border border-sage/10 hover:border-sky hover:bg-sky/5 text-left text-sm font-bold group transition-all"
                                                >
                                                    <span className="grow">{label}</span>
                                                </button>
                                            ))
                                        ) : (
                                            ['Not at all', 'Several days', 'Over half the days', 'Nearly every day'].map((label, i) => (
                                                <button
                                                    key={label}
                                                    onClick={() => handleAnswer(i)}
                                                    className="w-full p-4 rounded-2xl bg-sage/5 dark:bg-navy/30 border border-sage/10 hover:border-emerald-500 hover:bg-emerald-50/5 text-left text-sm font-bold group transition-all"
                                                >
                                                    <span className="grow">{label}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {checkInStep === 2 && (
                                <div className="p-12 text-center">
                                    <div className="w-24 h-24 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 dark:text-sage mb-2">Complete!</h3>
                                    <p className="text-slate-500 dark:text-sage/60 font-medium mb-8">Your well-being dashboard has been updated with today's metrics.</p>
                                    <button
                                        onClick={resetCheckIn}
                                        className="w-full py-5 bg-sky text-slate-800 rounded-3xl font-black text-lg shadow-xl shadow-sky/20"
                                    >
                                        View My Results
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default StressDashboard;
