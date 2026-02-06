import React, { useState } from 'react';
import { Palette, Sparkles, Moon, Leaf, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, changeTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'classic', icon: <Sparkles size={18} />, label: 'Classic', color: 'bg-[#fdf6ec]' },
        { id: 'midnight', icon: <Moon size={18} />, label: 'Midnight', color: 'bg-[#0f172a]' },
        { id: 'forest', icon: <Leaf size={18} />, label: 'Forest', color: 'bg-[#052e16]' },
        { id: 'rose', icon: <Heart size={18} />, label: 'Rose', color: 'bg-[#fff1f2]' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 right-0 bg-white dark:bg-slate shadow-2xl rounded-3xl p-3 border border-sage/20 dark:border-slate/10 min-w-[160px]"
                    >
                        <div className="flex flex-col gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { changeTheme(t.id); setIsOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${theme === t.id
                                            ? 'bg-sky/20 text-sky-700'
                                            : 'hover:bg-sage/10 text-slate-600 dark:text-sage/60'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full ${t.color} border border-sage/20 flex items-center justify-center shadow-sm`}>
                                        {t.icon}
                                    </div>
                                    <span className="text-sm font-bold">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-sky text-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-sky/30 border-2 border-white/50"
            >
                <Palette size={24} />
            </motion.button>
        </div>
    );
};

export default ThemeToggle;
