import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Leaf,
    Zap,
    Trash2,
    Wind,
    Lock,
    Volume2,
    Trophy,
    MousePointer2,
    Sparkles,
    Eye,
    Hand,
    Ear,
    Smile,
    Activity
} from 'lucide-react';

// --- Sub-components moved outside to prevent re-mounting and focus loss ---
const GardenView = ({ points }) => {
    const stage = Math.min(Math.floor(points / 50), 4);
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate rounded-[3rem] border border-sage/10 min-h-[400px]">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute bottom-4 w-32 h-8 bg-amber-800/20 rounded-full blur-sm" />
                <motion.svg viewBox="0 0 100 100" className="w-full h-full">
                    <ellipse cx="50" cy="85" rx="30" ry="8" fill="#d4cca3" />
                    <motion.path
                        d="M50 85 Q50 60 50 40"
                        fill="none"
                        stroke="#81a89a"
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
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                d="M50 70 Q30 60 40 50 Q50 60 50 70" fill="#E8F3EE" stroke="#81a89a"
                            />
                        )}
                        {stage >= 3 && (
                            <motion.path
                                key="leaf2"
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                d="M50 60 Q70 60 60 40 Q50 50 50 60" fill="#E8F3EE" stroke="#81a89a"
                            />
                        )}
                        {stage >= 4 && (
                            <motion.circle
                                key="bloom"
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                cx="50" cy="40" r="10" fill="#0ea5e9" opacity="0.6"
                            />
                        )}
                    </AnimatePresence>
                </motion.svg>
                {stage >= 4 && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute top-10 w-24 h-24 bg-sky/20 rounded-full blur-2xl"
                    />
                )}
            </div>
            <div className="text-center mt-6">
                <h4 className="text-2xl font-black text-slate-800 dark:text-sage flex items-center justify-center gap-2">
                    Level {stage + 1} Garden
                    <Sparkles size={20} className="text-sky-500" />
                </h4>
                <p className="text-slate-500 dark:text-sage/60 font-medium text-sm mt-2">
                    Your Zen Garden grows as you complete activities.
                </p>
                <div className="mt-6 w-64 h-2 bg-sage/10 rounded-full overflow-hidden mx-auto">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(points % 50) * 2}%` }}
                        className="h-full bg-sky-500"
                    />
                </div>
            </div>
        </div>
    );
};

const MindGamesView = ({ bubbles, popBubble, groundingStep, setGroundingStep, completeGrounding }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate p-8 rounded-[3rem] border border-sage/10 text-center">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black text-slate-800 dark:text-sage flex items-center gap-2">
                    <MousePointer2 size={20} className="text-sky-500" />
                    Bubble Pop
                </h4>
                <span className="text-xs font-black text-sky-600 bg-sky/10 px-3 py-1 rounded-full uppercase">Instant Calm</span>
            </div>
            <div className="grid grid-cols-5 gap-3 max-w-[200px] mx-auto">
                {bubbles.map((popped, i) => (
                    <motion.button
                        key={`bubble-${i}`}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => popBubble(i)}
                        className={`w-8 h-8 rounded-full shadow-inner border-2 transition-all ${popped
                            ? 'bg-sage/10 border-transparent'
                            : 'bg-white dark:bg-navy/40 border-sage/20'
                            }`}
                    />
                ))}
            </div>
            <p className="mt-6 text-sm text-slate-400 font-medium leading-relaxed">
                Simple, satisfying popping to relieve tactile tension.
            </p>
        </div>

        <div className="bg-white dark:bg-slate p-8 rounded-[3rem] border border-sage/10">
            <h4 className="text-xl font-black text-slate-800 dark:text-sage mb-6 flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" />
                5-4-3-2-1 Sensory
            </h4>
            <AnimatePresence mode="wait">
                {groundingStep === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <button
                            onClick={() => setGroundingStep(1)}
                            className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all"
                        >
                            Start Grounding
                        </button>
                    </motion.div>
                )}
                {groundingStep > 0 && groundingStep <= 5 && (
                    <motion.div key={`step-${groundingStep}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                                {groundingStep === 1 && <Eye size={24} />}
                                {groundingStep === 2 && <Hand size={24} />}
                                {groundingStep === 3 && <Ear size={24} />}
                                {groundingStep === 4 && <Wind size={24} />}
                                {groundingStep === 5 && <Smile size={24} />}
                            </div>
                            <div>
                                <h5 className="font-black text-slate-700 dark:text-sage">Step {groundingStep}</h5>
                                <p className="text-xs text-slate-400">Sensory observation</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-sage/60 mb-6 min-h-[40px]">
                            {groundingStep === 1 && "Name 5 things you can see right now."}
                            {groundingStep === 2 && "Name 4 things you can touch around you."}
                            {groundingStep === 3 && "Name 3 things you can hear."}
                            {groundingStep === 4 && "Name 2 things you can smell."}
                            {groundingStep === 5 && "Name 1 thing you can taste."}
                        </p>
                        <button
                            onClick={groundingStep === 5 ? completeGrounding : () => setGroundingStep(s => s + 1)}
                            className="w-full bg-slate-50 dark:bg-navy/30 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                        >
                            {groundingStep === 5 ? "Finish" : "Next"} <ChevronRight size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);

const WorryBoxView = ({ worry, setWorry, isWorryDissolving, handleWorrySubmit }) => (
    <div className="bg-white dark:bg-slate p-12 rounded-[3.5rem] border border-sage/10 text-center relative overflow-hidden">
        <motion.div
            animate={{
                rotate: isWorryDissolving ? 360 : 0,
                scale: isWorryDissolving ? 0.8 : 1
            }}
            className="w-20 h-20 bg-sky/10 rounded-3xl flex items-center justify-center text-sky-600 mx-auto mb-8 shadow-inner"
        >
            <Trash2 size={40} />
        </motion.div>
        <h3 className="text-3xl font-black text-slate-800 dark:text-sage mb-4">The Worry Box</h3>
        <p className="text-slate-500 dark:text-sage/60 max-w-md mx-auto mb-10 font-medium">
            Type out whatever is stressing you. Click release, and watch it dissolve into peace.
        </p>
        <form onSubmit={handleWorrySubmit} className="max-w-md mx-auto relative">
            <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="What's bothering you?"
                disabled={isWorryDissolving}
                autoFocus
                className="w-full p-6 bg-sage/5 dark:bg-navy/40 border-2 border-sage/10 rounded-3xl min-h-[150px] outline-none focus:border-sky/40 transition-all font-medium resize-none shadow-sm"
            />
            <AnimatePresence>
                {isWorryDissolving && (
                    <motion.div
                        key="releasing"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0, y: -100, scale: 0.5, filter: 'blur(10px)' }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-sky-600 font-bold text-lg">Releasing...</div>
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                type="submit"
                disabled={!worry.trim() || isWorryDissolving}
                className="mt-6 w-full bg-slate-800 dark:bg-sky text-white dark:text-slate-900 py-5 rounded-[2rem] font-black shadow-2xl disabled:opacity-50 hover:scale-105 transition-transform active:scale-95"
            >
                Release to the Universe
            </button>
        </form>
    </div>
);

const ZenQuest = () => {
    // --- State Management ---
    const [streak, setStreak] = useState(0);
    const [points, setPoints] = useState(0);
    const [activeTab, setActiveTab] = useState('garden'); // 'garden', 'games', 'worrybox'
    const [bubbles, setBubbles] = useState(Array(15).fill(false));
    const [worry, setWorry] = useState('');
    const [isWorryDissolving, setIsWorryDissolving] = useState(false);
    const [groundingStep, setGroundingStep] = useState(0);
    const [unlockedSounds, setUnlockedSounds] = useState(false);

    // --- Initialize Progress ---
    useEffect(() => {
        const savedStreak = localStorage.getItem('zen_streak') || 0;
        const savedPoints = localStorage.getItem('zen_points') || 0;
        setStreak(parseInt(savedStreak));
        setPoints(parseInt(savedPoints));
        if (parseInt(savedStreak) >= 3) setUnlockedSounds(true);
    }, []);

    // --- Handlers ---
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
        }, 3000);
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
        <section id="quest" className="py-24 px-4 bg-sage/5 dark:bg-navy/10 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl mb-12 gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -mr-32 -mt-32" />

                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm border border-sky-200 dark:border-sky-800">
                            <Zap size={32} />
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-1">{points}</div>
                            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Seeds Planted</div>
                        </div>

                        <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                        <div className="space-y-2">
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((d) => (
                                    <div
                                        key={d}
                                        className={`w-2.5 h-6 rounded-full transition-all duration-500 ${d <= 3 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">3 Day Streak!</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className={`p-4 rounded-2xl flex items-center gap-3 transition-colors ${unlockedSounds ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-800' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}>
                            {unlockedSounds ? <Volume2 size={24} /> : <Lock size={20} />}
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {unlockedSounds ? 'Soundscapes Unlocked' : '3-Day Reward Locked'}
                            </span>
                        </div>
                        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                            <Trophy size={24} />
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Gamepad2 size={14} /> The Calm Quest
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 px-2">Make Peace a <span className="text-sky-600 dark:text-sky-500">Habit</span></h2>
                    <div className="flex flex-wrap justify-center gap-2 mt-8 px-2">
                        {[
                            { id: 'garden', label: 'Garden', icon: <Leaf size={16} /> },
                            { id: 'games', label: 'Games', icon: <Gamepad2 size={16} /> },
                            { id: 'worrybox', label: 'Worry Box', icon: <Trash2 size={16} /> }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`px-4 md:px-8 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all ${activeTab === t.id
                                    ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-900 shadow-xl scale-105'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-[450px]"
                >
                    {activeTab === 'garden' && <GardenView points={points} />}
                    {activeTab === 'games' && (
                        <MindGamesView
                            bubbles={bubbles}
                            popBubble={popBubble}
                            groundingStep={groundingStep}
                            setGroundingStep={setGroundingStep}
                            completeGrounding={completeGrounding}
                        />
                    )}
                    {activeTab === 'worrybox' && (
                        <WorryBoxView
                            worry={worry}
                            setWorry={setWorry}
                            isWorryDissolving={isWorryDissolving}
                            handleWorrySubmit={handleWorrySubmit}
                        />
                    )}
                </motion.div>
            </div>
        </section>
    );
};

const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default ZenQuest;
