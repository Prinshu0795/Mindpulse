import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, changeTheme } = useTheme();

    const toggleTheme = () => {
        changeTheme(theme === 'classic' ? 'dark' : 'classic');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface text-text-secondary hover:text-text-primary hover:bg-bg transition-colors border border-border flex items-center justify-center min-w-[44px] min-h-[44px]"
            title={theme === 'classic' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
        >
            {theme === 'classic' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
