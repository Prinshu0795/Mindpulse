import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle = ({ className = '', compact = false }) => {
    const { theme, changeTheme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    if (compact) {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-lg bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors border border-border flex items-center justify-center min-w-[38px] min-h-[38px] cursor-pointer ${className}`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
            >
                {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-accent" />}
            </button>
        );
    }

    return (
        <div 
            className={`inline-flex items-center p-0.5 rounded-full bg-surface-subtle border border-border text-xs ${className}`}
            role="group" 
            aria-label="Theme selector"
        >
            <button
                type="button"
                onClick={() => changeTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-medium ${
                    !isDark
                        ? 'bg-surface text-text-primary shadow-xs font-semibold'
                        : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={!isDark}
                title="Switch to Light Theme"
            >
                <Sun size={14} className={!isDark ? "text-amber-500" : "text-text-secondary"} />
                <span>{t('footer.themeLight', 'Light')}</span>
            </button>
            <button
                type="button"
                onClick={() => changeTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-medium ${
                    isDark
                        ? 'bg-surface text-text-primary shadow-xs font-semibold'
                        : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={isDark}
                title="Switch to Dark Theme"
            >
                <Moon size={14} className={isDark ? "text-accent" : "text-text-secondary"} />
                <span>{t('footer.themeDark', 'Dark')}</span>
            </button>
        </div>
    );
};

export default ThemeToggle;

