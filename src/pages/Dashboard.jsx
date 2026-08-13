import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3, History, Activity, Info, CheckCircle2, AlertTriangle, ChevronRight, Moon, Zap, BrainCircuit, ClipboardList
} from 'lucide-react';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import DASS21 from '../components/assessments/DASS21';
import PHQ9 from '../components/assessments/PHQ9';
import WHO5 from '../components/assessments/WHO5';
import DailyCheckInModal from '../components/DailyCheckInModal';
import ChatSection from '../components/ChatSection';
import ZenQuest from '../components/ZenQuest';
import { useTranslation } from 'react-i18next';

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

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // State for Analytics Data
    const [analytics, setAnalytics] = useState({ checkins: [], mentalAssessments: [], legacyAssessments: [], topTriggers: [] });
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState(false);
    const [activeAssessmentModal, setActiveAssessmentModal] = useState(null); // 'PSS-10', 'GAD-7', 'DASS-21', 'PHQ-9', 'WHO-5'

    // Legacy Assessment state (for PSS-10 / GAD-7 inline modal)
    const [legacyStep, setLegacyStep] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [legacyResult, setLegacyResult] = useState(null);

    const fetchAnalytics = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('mindpulse_token');
            const response = await fetch(`${API_URL}/analytics/overview`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setAnalytics(data.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [user, API_URL]);

    // Legacy save logic (PSS-10, GAD-7)
    const saveLegacyStats = async (score, type) => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        const triggers = ['Work', 'Health', 'Family', 'Social', 'Money'];
        const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];
        
        const lastLegacy = analytics.legacyAssessments[analytics.legacyAssessments.length - 1] || {};
        const newEntry = {
            date: today,
            stress: type === 'PSS-10' ? score : (lastLegacy.stress || 15),
            anxiety: type === 'GAD-7' ? score : (lastLegacy.anxiety || 7),
            trigger: randomTrigger,
            fullDate: new Date().toISOString()
        };

        try {
            const token = localStorage.getItem('mindpulse_token');
            await fetch(`${API_URL}/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newEntry)
            });
            fetchAnalytics();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLegacyAnswer = (val) => {
        const questions = activeAssessmentModal === 'PSS-10' ? pssQuestions : gadQuestions;
        const newAnswers = [...answers, val];
        setAnswers(newAnswers);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            let score = 0;
            if (activeAssessmentModal === 'PSS-10') {
                newAnswers.forEach((ans, idx) => {
                    if ([3, 4, 6, 7].includes(idx)) score += (4 - ans);
                    else score += ans;
                });
            } else {
                score = newAnswers.reduce((a, b) => a + b, 0);
            }
            
            let severity = '';
            if (activeAssessmentModal === 'PSS-10') {
                if (score <= 13) severity = 'Low Stress';
                else if (score <= 26) severity = 'Moderate Stress';
                else severity = 'High Perceived Stress';
            } else {
                if (score <= 4) severity = 'Minimal Anxiety';
                else if (score <= 9) severity = 'Mild Anxiety';
                else if (score <= 14) severity = 'Moderate Anxiety';
                else severity = 'Severe Anxiety';
            }
            setLegacyResult({ score, severity });

            saveLegacyStats(score, activeAssessmentModal);
            
            // Log legacy tests into mental assessments history for unified tracking
            saveMentalAssessment({
                type: activeAssessmentModal,
                score,
                responses: newAnswers,
                severity
            });

            setLegacyStep(2);
        }
    };

    const saveMentalAssessment = async (data) => {
        try {
            const token = localStorage.getItem('mindpulse_token');
            await fetch(`${API_URL}/assessments/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            fetchAnalytics();
        } catch (err) {
            console.error(err);
        }
    };

    const closeLegacyModal = () => {
        setActiveAssessmentModal(null);
        setLegacyStep(0);
        setCurrentQuestionIdx(0);
        setAnswers([]);
        setLegacyResult(null);
    };

    const getInsights = () => {
        let insights = [];
        const { checkins } = analytics;
        if (checkins && checkins.length >= 2) {
            const latest = checkins[checkins.length - 1];
            const prev = checkins[checkins.length - 2];
            if (latest.stressLevel > prev.stressLevel) {
                insights.push("Your reported stress has increased recently compared to your previous check-in.");
            }
            if (latest.anxietyLevel > prev.anxietyLevel && latest.sleepQuality < prev.sleepQuality) {
                insights.push("Your recent check-ins show higher anxiety alongside lower sleep quality.");
            }
            if (latest.energyLevel > prev.energyLevel || ['Very Happy', 'Happy'].includes(latest.mood)) {
                insights.push("Your reported well-being has improved compared with your previous period.");
            }
        }
        if (insights.length === 0) insights.push("Complete more check-ins to unlock personalized trend insights.");
        return insights;
    };

    // Chart Data Formatting
    const trendData = analytics.checkins.map(ci => ({
        date: new Date(ci.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Stress: ci.stressLevel,
        Anxiety: ci.anxietyLevel,
        Energy: ci.energyLevel,
        Sleep: ci.sleepQuality
    }));

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-bg">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">{t('dashboard.title')}</h2>
                        <p className="text-text-secondary">{t('dashboard.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => {
                            if (!user) { alert('Please login first.'); return; }
                            setIsDailyCheckInOpen(true);
                        }}
                        className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
                    >
                        <Activity size={20} />
                        {t('dashboard.dailyCheckin')}
                    </button>
                </div>

                {!user || (analytics.checkins.length === 0 && analytics.legacyAssessments.length === 0 && analytics.mentalAssessments.length === 0) ? (
                    <div className="bg-surface rounded-xl p-10 border border-border text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-bg rounded-xl flex items-center justify-center text-accent mb-4 border border-border">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{t('dashboard.noDataTitle')}</h3>
                        <p className="text-text-secondary max-w-md mx-auto mb-6">
                            {t('dashboard.noDataDesc')}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {['PSS-10', 'GAD-7', 'DASS-21', 'PHQ-9', 'WHO-5'].map(test => (
                                <button
                                    key={test}
                                    onClick={() => setActiveAssessmentModal(test)}
                                    className="p-4 bg-surface border border-border hover:border-accent rounded-xl text-left transition-colors flex justify-between items-center group"
                                >
                                    <div>
                                        <h4 className="font-bold text-text-primary">{test}</h4>
                                        <p className="text-xs text-text-secondary">{t('dashboard.screening')}</p>
                                    </div>
                                    <ChevronRight className="text-text-secondary group-hover:text-accent" size={18} />
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-2 bg-surface rounded-xl p-6 border border-border">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                        <History size={20} className="text-text-secondary" />
                                        {t('dashboard.trendsTitle')}
                                    </h3>
                                </div>
                                {trendData.length > 0 ? (
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                                <YAxis hide domain={[0, 10]} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                                <Line type="monotone" dataKey="Stress" stroke="#EF4444" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="Anxiety" stroke="#F59E0B" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="Sleep" stroke="#4F46E5" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-72 flex items-center justify-center text-text-secondary">{t('dashboard.noTrendData')}</div>
                                )}
                            </div>

                            <div className="bg-surface rounded-xl p-6 border border-border flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <BrainCircuit size={20} className="text-accent" />
                                        {t('dashboard.insightsTitle')}
                                    </h3>
                                    <div className="space-y-4">
                                        {getInsights().map((insight, i) => (
                                            <div key={i} className="p-4 bg-bg border border-border rounded-lg text-sm text-text-primary">
                                                {insight}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Latest Assessment Scores */}
                        <div className="bg-surface rounded-xl p-6 border border-border mb-6">
                            <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-accent" />
                                {t('dashboard.latestScoresTitle')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {['PSS-10', 'GAD-7', 'DASS-21', 'PHQ-9', 'WHO-5'].map(type => {
                                    const latest = analytics.mentalAssessments?.find(a => a.type === type) 
                                        || (['PSS-10', 'GAD-7'].includes(type) ? [...(analytics.legacyAssessments || [])].reverse().map(l => ({
                                            type: type,
                                            score: type === 'PSS-10' ? l.stress : l.anxiety,
                                            severity: 'Legacy Data'
                                        }))[0] : null);

                                    return (
                                        <div key={type} className="bg-bg p-4 rounded-xl border border-border flex flex-col justify-center items-center text-center">
                                            <div className="text-xs font-bold text-text-secondary uppercase mb-2">{type}</div>
                                            {latest ? (
                                                latest.subScores ? (
                                                    <div className="text-[10px] space-y-0.5">
                                                        <div className="text-accent font-bold">D:{latest.subScores.depression} A:{latest.subScores.anxiety} S:{latest.subScores.stress}</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="text-2xl font-bold text-accent">
                                                            {latest.score}{type === 'WHO-5' ? '%' : ''}
                                                        </div>
                                                        <div className="text-[10px] text-text-primary mt-1 leading-tight">{latest.severity}</div>
                                                    </>
                                                )
                                            ) : (
                                                <div className="text-xs text-text-secondary italic">No Data</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-surface rounded-xl p-6 border border-border">
                                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-text-secondary" />
                                    {t('dashboard.triggersTitle')}
                                </h3>
                                {analytics.topTriggers.length > 0 ? (
                                    <div className="space-y-4">
                                        {analytics.topTriggers.slice(0, 5).map((t, i) => {
                                            const max = analytics.topTriggers[0].count;
                                            return (
                                                <div key={t.name} className="flex items-center gap-4">
                                                    <span className="w-24 text-sm font-medium text-text-secondary truncate" title={t.name}>{t.name}</span>
                                                    <div className="grow h-2.5 bg-bg rounded-full overflow-hidden border border-border flex items-center">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(t.count / max) * 100}%` }} className="h-full rounded-full" style={{backgroundColor: COLORS[i%COLORS.length]}} />
                                                    </div>
                                                    <span className="text-xs text-text-secondary w-4">{t.count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-text-secondary">{t('dashboard.noTriggers')}</div>
                                )}
                            </div>

                            <div className="bg-surface rounded-xl p-6 border border-border">
                                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                                    <Moon size={20} className="text-indigo-500" />
                                    {t('dashboard.sleepEnergyTitle')}
                                </h3>
                                {analytics.checkins.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center p-4 bg-bg rounded-lg border border-border">
                                            <span className="text-text-secondary font-medium">{t('dashboard.avgSleep')}</span>
                                            <span className="text-xl font-bold text-indigo-500">
                                                {(analytics.checkins.reduce((a, b) => a + b.sleepQuality, 0) / analytics.checkins.length).toFixed(1)} / 10
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-bg rounded-lg border border-border">
                                            <span className="text-text-secondary font-medium">{t('dashboard.avgEnergy')}</span>
                                            <span className="text-xl font-bold text-amber-500 flex items-center gap-2">
                                                <Zap size={16} />
                                                {(analytics.checkins.reduce((a, b) => a + b.energyLevel, 0) / analytics.checkins.length).toFixed(1)} / 10
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary text-center mt-4">
                                            {t('dashboard.sleepDesc')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-text-secondary">{t('dashboard.noSleepData')}</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-surface rounded-xl p-6 border border-border mt-6 mb-6">
                            <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                                <ClipboardList size={20} className="text-accent" />
                                {t('dashboard.historyTitle')}
                            </h3>
                            {analytics.mentalAssessments && analytics.mentalAssessments.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {[...analytics.mentalAssessments].reverse().map(ma => (
                                        <div key={ma._id} className="p-4 bg-bg border border-border rounded-lg flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-text-primary">{ma.type}</h4>
                                                <p className="text-xs text-text-secondary mt-1">
                                                    {new Date(ma.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {ma.type === 'DASS-21' ? (
                                                    <div className="text-sm font-bold text-accent whitespace-pre-wrap text-right">
                                                        {ma.severity}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="text-lg font-bold text-accent">
                                                            {ma.score}{ma.type === 'WHO-5' ? '%' : ''}
                                                        </div>
                                                        <div className="text-xs font-medium text-text-primary">{ma.severity}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-text-secondary">{t('dashboard.noHistory')}</div>
                            )}
                        </div>
                    </>
                )}

                {/* AI Wellness Insight & Exercises Integration */}
                <div className="mt-12 space-y-12 mb-12">
                    <ChatSection />
                    <ZenQuest />
                </div>
            </div>

            <AnimatePresence>

                {isDailyCheckInOpen && (
                    <DailyCheckInModal 
                        onClose={() => setIsDailyCheckInOpen(false)} 
                        onComplete={() => {
                            fetchAnalytics();
                        }} 
                    />
                )}

                {activeAssessmentModal === 'PHQ-9' && <PHQ9 onClose={() => setActiveAssessmentModal(null)} onComplete={saveMentalAssessment} />}
                {activeAssessmentModal === 'WHO-5' && <WHO5 onClose={() => setActiveAssessmentModal(null)} onComplete={saveMentalAssessment} />}
                
                {/* Legacy Inline Modal for PSS-10 and GAD-7 */}
                {(activeAssessmentModal === 'PSS-10' || activeAssessmentModal === 'GAD-7') && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLegacyModal} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden overflow-y-auto max-h-[90vh] border border-border">
                            {legacyStep === 0 && (
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="px-3 py-1 bg-bg text-text-primary border border-border rounded-full text-xs font-bold uppercase">{activeAssessmentModal}</span>
                                        <span className="text-sm font-medium text-text-secondary">{currentQuestionIdx + 1} {t('assessments.of')} {activeAssessmentModal === 'PSS-10' ? pssQuestions.length : gadQuestions.length}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-8 leading-snug">
                                        {activeAssessmentModal === 'PSS-10' ? pssQuestions[currentQuestionIdx] : gadQuestions[currentQuestionIdx]}
                                    </h3>
                                    <div className="space-y-3">
                                        {activeAssessmentModal === 'PSS-10' ? (
                                            ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'].map((label, i) => (
                                                <button key={label} onClick={() => handleLegacyAnswer(i)} className="w-full p-4 rounded-xl bg-bg border border-border hover:border-accent text-left text-sm font-medium transition-colors text-text-primary">{label}</button>
                                            ))
                                        ) : (
                                            ['Not at all', 'Several days', 'Over half the days', 'Nearly every day'].map((label, i) => (
                                                <button key={label} onClick={() => handleLegacyAnswer(i)} className="w-full p-4 rounded-xl bg-bg border border-border hover:border-accent text-left text-sm font-medium transition-colors text-text-primary">{label}</button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                            {legacyStep === 2 && (
                                <div className="p-6 md:p-8 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">{t('dashboard.legacyComplete')}</h3>
                                    <p className="text-text-secondary mb-4">{t('dashboard.legacyUpdated')}</p>
                                    
                                    {legacyResult && (
                                        <div className="bg-bg rounded-xl p-4 border border-border mb-8">
                                            <div className="text-sm text-text-secondary mb-1">{t('assessments.yourScore')}</div>
                                            <div className="text-3xl font-bold text-accent mb-1">{legacyResult.score}</div>
                                            <div className="text-sm font-medium text-text-primary">{legacyResult.severity}</div>
                                        </div>
                                    )}

                                    <p className="text-xs text-text-secondary mb-8 max-w-xs mx-auto">{t('dashboard.legacyDisclaimer')}</p>
                                    <button onClick={closeLegacyModal} className="w-full py-4 bg-accent text-white rounded-xl font-medium transition-colors hover:bg-accent/90">{t('dashboard.viewResults')}</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
