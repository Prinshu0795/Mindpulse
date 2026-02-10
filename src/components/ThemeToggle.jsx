import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, changeTheme } = useTheme();

    const toggleTheme = () => {
        changeTheme(theme === 'classic' ? 'dark' : 'classic');
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy/40 text-slate-600 dark:text-sage hover:bg-sky/20 transition-all border border-slate-200 dark:border-slate/10 flex items-center justify-center"
            title={theme === 'classic' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            {theme === 'classic' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
    );
};

export default ThemeToggle;
