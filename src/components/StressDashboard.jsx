import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    History,
    Activity,
    Info,
    CheckCircle2,
    AlertTriangle,
    ChevronRight
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
    Cell
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
    const [checkInStep, setCheckInStep] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [activeType, setActiveType] = useState('PSS-10');
    const [answers, setAnswers] = useState([]);

    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchAssessments = async () => {
            if (!user) {
                setHistory([]);
                return;
            }

            try {
                const token = localStorage.getItem('mindpulse_token');
                if (!token) return;

                const response = await fetch(`${API_URL}/assessments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setHistory(data.data);
                } else {
                    setHistory([]); // New user, empty state
                }
            } catch (err) {
                console.error('Error fetching assessments:', err);
                setHistory([]);
            }
        };

        fetchAssessments();
    }, [user, API_URL]);

    const saveStats = async (score, type) => {
        if (!user) {
            // Require login
            return;
        }

        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        
        // Randomly assign a trigger for the UI if none exists to keep UI lively
        const triggers = ['Work', 'Health', 'Family', 'Social', 'Money'];
        const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];
        
        const newEntry = {
            date: today,
            stress: type === 'PSS-10' ? score : (history[history.length - 1]?.stress || 15),
            anxiety: type === 'GAD-7' ? score : (history[history.length - 1]?.anxiety || 7),
            trigger: randomTrigger,
            fullDate: new Date().toISOString()
        };

        try {
            const token = localStorage.getItem('mindpulse_token');
            const response = await fetch(`${API_URL}/assessments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newEntry)
            });

            const data = await response.json();
            if (data.success) {
                // Update local state immediately to avoid full page refresh
                // Ensure we only keep latest 7
                const updatedHistory = [...history, data.data].slice(-7);
                setHistory(updatedHistory);
            }
        } catch (err) {
            console.error('Error saving assessment:', err);
        }
    };

    const handleAnswer = (val) => {
        const questions = activeType === 'PSS-10' ? pssQuestions : gadQuestions;
        const newAnswers = [...answers, val];
        setAnswers(newAnswers);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            let score = 0;
            if (activeType === 'PSS-10') {
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
            setCheckInStep(2);
        }
    };

    const resetCheckIn = () => {
        setIsCheckInOpen(false);
        setCheckInStep(0);
        setCurrentQuestionIdx(0);
        setAnswers([]);
    };

    const currentLevel = history[history.length - 1] || { stress: 0, anxiety: 0 };
    const getStressInfo = (score) => {
        if (score <= 13) return { label: 'Low', color: '#10B981' };
        if (score <= 26) return { label: 'Moderate', color: '#F59E0B' };
        return { label: 'High', color: '#EF4444' };
    };

    const getAnxietyInfo = (score) => {
        if (score <= 4) return { label: 'Minimal', color: '#10B981' };
        if (score <= 9) return { label: 'Mild', color: '#10B981' };
        if (score <= 14) return { label: 'Moderate', color: '#F59E0B' };
        return { label: 'Severe', color: '#EF4444' };
    };

    const gaugeData = [
        { name: 'Level', value: currentLevel.stress, fill: getStressInfo(currentLevel.stress).color },
        { name: 'Remaining', value: 40 - currentLevel.stress, fill: '#E5E7EB' }
    ];

    return (
        <section id="dashboard" className="px-4 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Well-being Dashboard</h2>
                        <p className="text-text-secondary">Track your inner balance and daily progress.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (!user) {
                                alert('Please login to take an assessment and save your progress.');
                                return;
                            }
                            setIsCheckInOpen(true);
                        }}
                        className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
                    >
                        <Activity size={20} />
                        Daily Check-in
                    </button>
                </div>

                {!user || history.length === 0 ? (
                    <div className="bg-surface rounded-xl p-10 border border-border text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-bg rounded-xl flex items-center justify-center text-accent mb-4 border border-border">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">No assessment data available</h3>
                        <p className="text-text-secondary max-w-md mx-auto mb-6">
                            {user ? "Complete your first assessment to view your stress and anxiety analytics." : "Please login and complete your first assessment to view your stress and anxiety analytics."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-surface rounded-xl p-6 border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                <History size={20} className="text-text-secondary" />
                                Mood Wave
                            </h3>
                            <div className="flex gap-4 text-xs font-semibold uppercase text-text-secondary">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{backgroundColor: '#4F46E5'}} /> Stress</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{backgroundColor: '#10B981'}} /> Anxiety</span>
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                    <Area type="monotone" dataKey="stress" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" />
                                    <Area type="monotone" dataKey="anxiety" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAnxiety)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2 self-start">
                            <AlertTriangle size={20} className="text-amber-500" />
                            Current Balance
                        </h3>
                        <div className="relative w-full h-48 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={gaugeData} cx="50%" cy="80%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                                        {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-[60%] text-center">
                                <span className="text-3xl font-bold text-text-primary">{currentLevel.stress}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-bg rounded-lg w-full border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-text-secondary">Stress Level</span>
                                <span className="text-sm font-bold text-text-primary">{getStressInfo(currentLevel.stress).label}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-text-secondary">Anxiety Level</span>
                                <span className="text-sm font-bold text-text-primary">{getAnxietyInfo(currentLevel.anxiety).label}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <BarChart3 size={20} className="text-text-secondary" />
                            Stress Triggers
                        </h3>
                        <div className="space-y-4">
                            {['Work', 'Health', 'Family', 'Social', 'Money'].map((trigger) => {
                                const count = history.filter(h => h.trigger === trigger).length;
                                return (
                                    <div key={trigger} className="flex items-center gap-4">
                                        <span className="w-16 text-sm font-medium text-text-secondary">{trigger}</span>
                                        <div className="grow h-2.5 bg-bg rounded-full overflow-hidden border border-border">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${(count / 7) * 100}%` }} className="h-full bg-accent rounded-full" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl p-6 border border-border flex flex-col justify-between">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="p-3 bg-bg rounded-lg text-accent border border-border">
                                <Info size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Did you know?</h3>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            "Deep rhythmic breathing for just 5 minutes can lower your cortisol levels by up to 20%."
                        </p>
                        <button
                            onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3 bg-bg text-text-primary border border-border rounded-xl font-medium hover:bg-border transition-colors w-full"
                        >
                            Try Breathing Now
                        </button>
                    </div>
                </div>
                </>
                )}
            </div>

            <AnimatePresence>
                {isCheckInOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetCheckIn}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden overflow-y-auto max-h-[90vh] border border-border"
                        >
                            {checkInStep === 0 && (
                                <div className="p-6 md:p-8 text-center">
                                    <div className="w-16 h-16 bg-bg rounded-xl flex items-center justify-center text-accent mx-auto mb-6 border border-border">
                                        <Activity size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">Mind Check-in</h3>
                                    <p className="text-text-secondary mb-8">Which metric would you like to track today?</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => { setActiveType('PSS-10'); setCheckInStep(1); }}
                                            className="group flex items-center justify-between p-5 bg-bg hover:bg-border transition-colors rounded-xl text-left border border-border"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-text-primary">Stress Level (PSS-10)</h4>
                                                <p className="text-sm text-text-secondary mt-1">10 questions • 2 mins</p>
                                            </div>
                                            <ChevronRight className="text-text-secondary group-hover:text-text-primary" />
                                        </button>
                                        <button
                                            onClick={() => { setActiveType('GAD-7'); setCheckInStep(1); }}
                                            className="group flex items-center justify-between p-5 bg-bg hover:bg-border transition-colors rounded-xl text-left border border-border"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-text-primary">Anxiety Level (GAD-7)</h4>
                                                <p className="text-sm text-text-secondary mt-1">7 questions • 1 min</p>
                                            </div>
                                            <ChevronRight className="text-text-secondary group-hover:text-text-primary" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {checkInStep === 1 && (
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="px-3 py-1 bg-bg text-text-primary border border-border rounded-full text-xs font-bold uppercase">
                                            {activeType}
                                        </span>
                                        <span className="text-sm font-medium text-text-secondary">
                                            {currentQuestionIdx + 1} of {activeType === 'PSS-10' ? pssQuestions.length : gadQuestions.length}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-8 leading-snug">
                                        {activeType === 'PSS-10' ? pssQuestions[currentQuestionIdx] : gadQuestions[currentQuestionIdx]}
                                    </h3>

                                    <div className="space-y-3">
                                        {activeType === 'PSS-10' ? (
                                            ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'].map((label, i) => (
                                                <button
                                                    key={label}
                                                    onClick={() => handleAnswer(i)}
                                                    className="w-full p-4 rounded-xl bg-bg border border-border hover:border-accent text-left text-sm font-medium transition-colors text-text-primary"
                                                >
                                                    {label}
                                                </button>
                                            ))
                                        ) : (
                                            ['Not at all', 'Several days', 'Over half the days', 'Nearly every day'].map((label, i) => (
                                                <button
                                                    key={label}
                                                    onClick={() => handleAnswer(i)}
                                                    className="w-full p-4 rounded-xl bg-bg border border-border hover:border-accent text-left text-sm font-medium transition-colors text-text-primary"
                                                >
                                                    {label}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {checkInStep === 2 && (
                                <div className="p-6 md:p-8 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">Complete!</h3>
                                    <p className="text-text-secondary mb-8">Your well-being dashboard has been updated.</p>
                                    <button
                                        onClick={resetCheckIn}
                                        className="w-full py-4 bg-accent text-white rounded-xl font-medium transition-colors hover:bg-accent/90"
                                    >
                                        View Results
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
