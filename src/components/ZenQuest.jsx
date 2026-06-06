import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Leaf, Zap, Trash2, Wind, Lock, Volume2, Trophy, MousePointer2, Sparkles, Eye, Hand, Ear, Smile, Activity, ChevronRight } from 'lucide-react';

const GardenView = ({ points }) => {
    const stage = Math.min(Math.floor(points / 50), 4);
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-surface rounded-xl border border-border min-h-[400px]">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.svg viewBox="0 0 100 100" className="w-full h-full">
                    <ellipse cx="50" cy="85" rx="30" ry="8" fill="#E5E7EB" />
                    <motion.path d="M50 85 Q50 60 50 40" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 1 ? 1 : 0.1 }} transition={{ duration: 1.5 }} />
                    <AnimatePresence>
                        {stage >= 2 && <motion.path key="leaf1" initial={{ scale: 0 }} animate={{ scale: 1 }} d="M50 70 Q30 60 40 50 Q50 60 50 70" fill="#D1FAE5" stroke="#10B981" />}
                        {stage >= 3 && <motion.path key="leaf2" initial={{ scale: 0 }} animate={{ scale: 1 }} d="M50 60 Q70 60 60 40 Q50 50 50 60" fill="#D1FAE5" stroke="#10B981" />}
                        {stage >= 4 && <motion.circle key="bloom" initial={{ scale: 0 }} animate={{ scale: 1 }} cx="50" cy="40" r="10" fill="#4F46E5" opacity="0.8" />}
                    </AnimatePresence>
                </motion.svg>
            </div>
            <div className="text-center mt-6">
                <h4 className="text-xl font-bold text-text-primary flex items-center justify-center gap-2">
                    Level {stage + 1} Garden
                    <Sparkles size={18} className="text-accent" />
                </h4>
                <p className="text-text-secondary text-sm mt-2 font-medium">Your Zen Garden grows as you complete activities.</p>
                <div className="mt-6 w-64 h-2 bg-bg rounded-full overflow-hidden mx-auto border border-border">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(points % 50) * 2}%` }} className="h-full bg-accent" />
                </div>
            </div>
        </div>
    );
};

const MindGamesView = ({ bubbles, popBubble, groundingStep, setGroundingStep, completeGrounding }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 md:p-8 rounded-xl border border-border text-center">
            <div className="flex justify-between items-center mb-8">
                <h4 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <MousePointer2 size={18} className="text-accent" />
                    Bubble Pop
                </h4>
                <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wide">Instant Calm</span>
            </div>
            <div className="grid grid-cols-5 gap-3 max-w-[200px] mx-auto">
                {bubbles.map((popped, i) => (
                    <button
                        key={`bubble-${i}`}
                        onClick={() => popBubble(i)}
                        className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${popped ? 'bg-bg border border-border cursor-default' : 'bg-surface border-2 border-accent hover:bg-accent/10 cursor-pointer active:scale-90'}`}
                        disabled={popped}
                        aria-label={`Pop bubble ${i + 1}`}
                    />
                ))}
            </div>
            <p className="mt-8 text-sm text-text-secondary font-medium leading-relaxed">Simple, satisfying popping to relieve tactile tension.</p>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-xl border border-border">
            <h4 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                5-4-3-2-1 Sensory
            </h4>
            <AnimatePresence mode="wait">
                {groundingStep === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                        <button onClick={() => setGroundingStep(1)} className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors w-full">
                            Start Grounding
                        </button>
                    </motion.div>
                )}
                {groundingStep > 0 && groundingStep <= 5 && (
                    <motion.div key={`step-${groundingStep}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-bg border border-border text-accent rounded-xl flex items-center justify-center">
                                {groundingStep === 1 && <Eye size={24} />}
                                {groundingStep === 2 && <Hand size={24} />}
                                {groundingStep === 3 && <Ear size={24} />}
                                {groundingStep === 4 && <Wind size={24} />}
                                {groundingStep === 5 && <Smile size={24} />}
                            </div>
                            <div>
                                <h5 className="font-bold text-text-primary">Step {groundingStep}</h5>
                                <p className="text-sm text-text-secondary">Sensory observation</p>
                            </div>
                        </div>
                        <p className="text-base font-medium text-text-primary mb-8 min-h-[48px]">
                            {groundingStep === 1 && "Name 5 things you can see right now."}
                            {groundingStep === 2 && "Name 4 things you can touch around you."}
                            {groundingStep === 3 && "Name 3 things you can hear."}
                            {groundingStep === 4 && "Name 2 things you can smell."}
                            {groundingStep === 5 && "Name 1 thing you can taste."}
                        </p>
                        <button
                            onClick={groundingStep === 5 ? completeGrounding : () => setGroundingStep(s => s + 1)}
                            className="w-full bg-bg border border-border py-3 rounded-xl font-medium text-text-primary hover:bg-surface transition-colors flex items-center justify-center gap-2"
                        >
                            {groundingStep === 5 ? "Finish" : "Next"} <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);

const WorryBoxView = ({ worry, setWorry, isWorryDissolving, handleWorrySubmit }) => (
    <div className="bg-surface p-8 md:p-12 rounded-xl border border-border text-center relative overflow-hidden">
        <div className={`w-16 h-16 bg-bg border border-border rounded-xl flex items-center justify-center text-text-secondary mx-auto mb-6 transition-transform duration-1000 ${isWorryDissolving ? 'rotate-180 scale-50 opacity-0' : ''}`}>
            <Trash2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">The Worry Box</h3>
        <p className="text-text-secondary max-w-md mx-auto mb-8 text-sm md:text-base">
            Type out whatever is stressing you. Click release, and watch it dissolve into peace.
        </p>
        <form onSubmit={handleWorrySubmit} className="max-w-md mx-auto relative">
            <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="What's bothering you?"
                disabled={isWorryDissolving}
                autoFocus
                className={`w-full p-4 bg-bg border border-border rounded-xl min-h-[150px] outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium resize-none text-text-primary ${isWorryDissolving ? 'opacity-0 blur-sm' : 'opacity-100'}`}
            />
            {isWorryDissolving && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-text-primary font-bold">Releasing...</div>
                </div>
            )}
            <button
                type="submit"
                disabled={!worry.trim() || isWorryDissolving}
                className="mt-6 w-full bg-accent text-white py-4 rounded-xl font-medium disabled:opacity-50 hover:bg-accent/90 transition-colors"
            >
                Release to the Universe
            </button>
        </form>
    </div>
);

const ZenQuest = () => {
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
        <section id="quest" className="px-4 bg-bg scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface p-6 md:p-8 rounded-xl border border-border mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-bg border border-border rounded-xl flex items-center justify-center text-accent">
                            <Zap size={28} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-text-primary leading-none mb-1">{points}</div>
                            <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Seeds Planted</div>
                        </div>

                        <div className="hidden md:block h-12 w-px bg-border mx-2" />

                        <div className="hidden md:block space-y-2">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((d) => (
                                    <div key={d} className={`w-3 h-8 rounded-full ${d <= 3 ? 'bg-emerald-500' : 'bg-bg border border-border'}`} />
                                ))}
                            </div>
                            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">3 Day Streak!</div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className={`flex-1 md:flex-none p-3 md:p-4 rounded-xl flex items-center justify-center gap-3 border ${unlockedSounds ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-bg border-border text-text-secondary'}`}>
                            {unlockedSounds ? <Volume2 size={20} /> : <Lock size={20} />}
                            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
                                {unlockedSounds ? 'Soundscapes Unlocked' : '3-Day Reward Locked'}
                            </span>
                        </div>
                        <div className="p-3 md:p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center">
                            <Trophy size={20} />
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-bg border border-border text-text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <Gamepad2 size={14} className="text-accent" /> The Calm Quest
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-8">Make Peace a Habit</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { id: 'garden', label: 'Garden', icon: <Leaf size={16} /> },
                            { id: 'games', label: 'Games', icon: <Gamepad2 size={16} /> },
                            { id: 'worrybox', label: 'Worry Box', icon: <Trash2 size={16} /> }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors border ${activeTab === t.id
                                    ? 'bg-accent text-white border-accent'
                                    : 'bg-surface text-text-secondary border-border hover:bg-bg hover:text-text-primary'
                                    }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-h-[450px]">
                    {activeTab === 'garden' && <GardenView points={points} />}
                    {activeTab === 'games' && <MindGamesView bubbles={bubbles} popBubble={popBubble} groundingStep={groundingStep} setGroundingStep={setGroundingStep} completeGrounding={completeGrounding} />}
                    {activeTab === 'worrybox' && <WorryBoxView worry={worry} setWorry={setWorry} isWorryDissolving={isWorryDissolving} handleWorrySubmit={handleWorrySubmit} />}
                </div>
            </div>
        </section>
    );
};

export default ZenQuest;
