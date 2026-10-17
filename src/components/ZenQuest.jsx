import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Gamepad2, Leaf, Zap, Trash2, Wind, Lock, Volume2, Trophy, 
    MousePointer2, Sparkles, Eye, Hand, Ear, Smile, Activity, ChevronRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GardenView = ({ points }) => {
    const { t } = useTranslation();
    const stage = Math.min(Math.floor(points / 50), 4);
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-surface rounded-3xl border border-border min-h-[420px] shadow-sm">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <ellipse cx="50" cy="85" rx="30" ry="8" fill="var(--color-border)" opacity="0.6" />
                    <motion.path 
                        d="M50 85 Q50 60 50 40" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: stage >= 1 ? 1 : 0.1 }} 
                        transition={{ duration: 1.5 }} 
                    />
                    <AnimatePresence>
                        {stage >= 2 && (
                            <motion.path 
                                key="leaf1" 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                d="M50 70 Q30 60 40 50 Q50 60 50 70" 
                                fill="#D1FAE5" 
                                stroke="#10B981" 
                                strokeWidth="2"
                            />
                        )}
                        {stage >= 3 && (
                            <motion.path 
                                key="leaf2" 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                d="M50 60 Q70 60 60 40 Q50 50 50 60" 
                                fill="#D1FAE5" 
                                stroke="#10B981" 
                                strokeWidth="2"
                            />
                        )}
                        {stage >= 4 && (
                            <motion.circle 
                                key="bloom" 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                cx="50" 
                                cy="40" 
                                r="10" 
                                fill="#176B63" 
                                opacity="0.9" 
                            />
                        )}
                    </AnimatePresence>
                </motion.svg>
            </div>
            <div className="text-center mt-6">
                <h4 className="text-xl font-bold text-text-primary flex items-center justify-center gap-2">
                    {t('zenquest.level')} {stage + 1} {t('zenquest.garden')}
                    <Sparkles size={18} className="text-accent" />
                </h4>
                <p className="text-text-secondary text-sm mt-2 font-medium max-w-sm">{t('zenquest.gardenDesc')}</p>
                <div className="mt-6 w-64 h-2.5 bg-bg rounded-full overflow-hidden mx-auto border border-border">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(points % 50) * 2}%` }} className="h-full bg-accent" />
                </div>
            </div>
        </div>
    );
};

const MindGamesView = ({ bubbles, popBubble, groundingStep, setGroundingStep, completeGrounding }) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bubble Pop */}
            <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border text-center shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
                        <MousePointer2 size={18} className="text-accent" />
                        {t('zenquest.bubblePop')}
                    </h4>
                    <span className="text-[11px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        {t('zenquest.instantCalm')}
                    </span>
                </div>
                <div className="grid grid-cols-5 gap-3 max-w-[220px] mx-auto py-2">
                    {bubbles.map((popped, i) => (
                        <button
                            key={`bubble-${i}`}
                            type="button"
                            onClick={() => popBubble(i)}
                            className={`w-10 h-10 rounded-full transition-all duration-150 flex items-center justify-center ${
                                popped 
                                    ? 'bg-bg border border-border text-text-secondary/40 cursor-default scale-90' 
                                    : 'bg-accent/15 border-2 border-accent hover:bg-accent/25 cursor-pointer active:scale-90 shadow-sm'
                            }`}
                            disabled={popped}
                            aria-label={`Pop bubble ${i + 1}`}
                        >
                            {popped ? '✓' : ''}
                        </button>
                    ))}
                </div>
                <p className="mt-6 text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
                    {t('zenquest.bubbleDesc')}
                </p>
            </div>

            {/* 5-4-3-2-1 Sensory Grounding */}
            <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" />
                            {t('zenquest.sensory')}
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            Mindfulness
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        {groundingStep === 0 && (
                            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                                <p className="text-sm text-text-secondary mb-6">
                                    The 5-4-3-2-1 technique anchors your mind to the present moment through your senses, reducing physical panic and racing thoughts.
                                </p>
                                <button 
                                    onClick={() => setGroundingStep(1)} 
                                    className="bg-accent text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 w-full"
                                >
                                    {t('zenquest.startGrounding')}
                                </button>
                            </motion.div>
                        )}
                        {groundingStep > 0 && groundingStep <= 5 && (
                            <motion.div key={`step-${groundingStep}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-2">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 bg-bg border border-border text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        {groundingStep === 1 && <Eye size={22} />}
                                        {groundingStep === 2 && <Hand size={22} />}
                                        {groundingStep === 3 && <Ear size={22} />}
                                        {groundingStep === 4 && <Wind size={22} />}
                                        {groundingStep === 5 && <Smile size={22} />}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-text-primary text-sm sm:text-base">{t('zenquest.step')} {groundingStep}</h5>
                                        <p className="text-xs text-text-secondary">{t('zenquest.sensoryObs')}</p>
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-text-primary mb-6 min-h-[52px] leading-relaxed">
                                    {groundingStep === 1 && t('zenquest.see')}
                                    {groundingStep === 2 && t('zenquest.touch')}
                                    {groundingStep === 3 && t('zenquest.hear')}
                                    {groundingStep === 4 && t('zenquest.smell')}
                                    {groundingStep === 5 && t('zenquest.taste')}
                                </p>
                                <button
                                    onClick={groundingStep === 5 ? completeGrounding : () => setGroundingStep(s => s + 1)}
                                    className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <span>{groundingStep === 5 ? t('zenquest.finish') : t('common.next')}</span>
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const WorryBoxView = ({ worry, setWorry, isWorryDissolving, handleWorrySubmit }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-surface p-6 sm:p-10 rounded-3xl border border-border text-center relative overflow-hidden shadow-sm">
            <div className={`w-16 h-16 bg-bg border border-border rounded-2xl flex items-center justify-center text-text-secondary mx-auto mb-5 transition-transform duration-1000 ${isWorryDissolving ? 'rotate-180 scale-50 opacity-0' : ''}`}>
                <Trash2 size={28} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">{t('zenquest.worryBox')}</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-6 text-xs sm:text-sm leading-relaxed">
                {t('zenquest.worryDesc')}
            </p>
            <form onSubmit={handleWorrySubmit} className="max-w-md mx-auto relative">
                <textarea
                    value={worry}
                    onChange={(e) => setWorry(e.target.value)}
                    placeholder={t('zenquest.bothering')}
                    disabled={isWorryDissolving}
                    rows={4}
                    className={`w-full p-4 bg-bg border border-border rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 transition-all font-medium resize-none text-text-primary text-sm leading-relaxed ${isWorryDissolving ? 'opacity-0 blur-sm' : 'opacity-100'}`}
                />
                {isWorryDissolving && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-accent font-extrabold text-lg animate-pulse">{t('zenquest.releasing')}</div>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={!worry.trim() || isWorryDissolving}
                    className="mt-4 w-full bg-accent text-white py-3.5 rounded-2xl font-bold disabled:opacity-50 hover:bg-accent/90 transition-all shadow-md shadow-accent/20 active:scale-[0.98]"
                >
                    {t('zenquest.releaseUniverse')}
                </button>
            </form>
        </div>
    );
};

const ZenQuest = () => {
    const { t } = useTranslation();
    const [streak, setStreak] = useState(0);
    const [points, setPoints] = useState(0);
    const [activeTab, setActiveTab] = useState('garden');
    const [bubbles, setBubbles] = useState(Array(15).fill(false));
    const [worry, setWorry] = useState('');
    const [isWorryDissolving, setIsWorryDissolving] = useState(false);
    const [groundingStep, setGroundingStep] = useState(0);
    const [unlockedSounds, setUnlockedSounds] = useState(false);

    useEffect(() => {
        const savedStreak = localStorage.getItem('zen_streak') || 0;
        const savedPoints = localStorage.getItem('zen_points') || 0;
        setStreak(parseInt(savedStreak));
        setPoints(parseInt(savedPoints));
        if (parseInt(savedStreak) >= 3) setUnlockedSounds(true);
    }, []);

    const popBubble = (idx) => {
        if (bubbles[idx]) return;
        const newBubbles = [...bubbles];
        newBubbles[idx] = true;
        setBubbles(newBubbles);
        setPoints(p => {
            const newPoints = p + 5;
            localStorage.setItem('zen_points', newPoints.toString());
            return newPoints;
        });

        if (newBubbles.every(b => b)) {
            setTimeout(() => setBubbles(Array(15).fill(false)), 1000);
        }
    };

    const handleWorrySubmit = (e) => {
        e.preventDefault();
        if (!worry.trim()) return;
        setIsWorryDissolving(true);
        setPoints(p => {
            const newPoints = p + 10;
            localStorage.setItem('zen_points', newPoints.toString());
            return newPoints;
        });
        setTimeout(() => {
            setWorry('');
            setIsWorryDissolving(false);
        }, 2000);
    };

    const completeGrounding = () => {
        setPoints(p => {
            const newPoints = p + 20;
            localStorage.setItem('zen_points', newPoints.toString());
            return newPoints;
        });
        setGroundingStep(0);
    };

    return (
        <section id="quest" className="px-2 sm:px-4 bg-bg scroll-mt-24 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Stats Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface p-5 sm:p-6 rounded-3xl border border-border mb-8 gap-5 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-bg border border-border rounded-2xl flex items-center justify-center text-accent shadow-sm">
                            <Zap size={26} />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-none mb-1">{points}</div>
                            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('zenquest.seeds')}</div>
                        </div>

                        <div className="hidden sm:block h-10 w-px bg-border mx-2" />

                        <div className="hidden sm:block space-y-1.5">
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((d) => (
                                    <div key={d} className={`w-3 h-6 rounded-full transition-colors ${d <= 3 ? 'bg-emerald-500' : 'bg-bg border border-border'}`} />
                                ))}
                            </div>
                            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{t('zenquest.streak')}</div>
                        </div>
                    </div>

                    <div className="flex gap-2.5 w-full md:w-auto">
                        <div className={`flex-1 md:flex-none px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2.5 border text-xs font-bold uppercase tracking-wider ${
                            unlockedSounds 
                                ? 'bg-accent/10 border-accent/30 text-accent' 
                                : 'bg-bg border-border text-text-secondary'
                        }`}>
                            {unlockedSounds ? <Volume2 size={16} /> : <Lock size={16} />}
                            <span className="hidden sm:inline">
                                {unlockedSounds ? t('zenquest.soundsUnlocked') : t('zenquest.soundsLocked')}
                            </span>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                            <Trophy size={18} />
                        </div>
                    </div>
                </div>

                {/* Heading & Tabs */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                        <Gamepad2 size={14} /> {t('zenquest.calmQuest')}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-6">{t('zenquest.habit')}</h2>
                    
                    <div className="inline-flex p-1.5 bg-surface border border-border rounded-2xl gap-1.5 shadow-sm">
                        {[
                            { id: 'garden', label: t('zenquest.garden'), icon: <Leaf size={15} /> },
                            { id: 'games', label: t('zenquest.games'), icon: <Gamepad2 size={15} /> },
                            { id: 'worrybox', label: t('zenquest.worryBox'), icon: <Trash2 size={15} /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-h-[420px]">
                    {activeTab === 'garden' && <GardenView points={points} />}
                    {activeTab === 'games' && <MindGamesView bubbles={bubbles} popBubble={popBubble} groundingStep={groundingStep} setGroundingStep={setGroundingStep} completeGrounding={completeGrounding} />}
                    {activeTab === 'worrybox' && <WorryBoxView worry={worry} setWorry={setWorry} isWorryDissolving={isWorryDissolving} handleWorrySubmit={handleWorrySubmit} />}
                </div>
            </div>
        </section>
    );
};

export default ZenQuest;
