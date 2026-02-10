import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('mindpulse-theme') || 'classic');

    useEffect(() => {
        // Remove existing theme classes
        const themes = ['classic', 'dark'];
        themes.forEach(t => document.documentElement.classList.remove(`theme-${t}`));
        document.documentElement.classList.remove('dark');

        // Add current theme class
        document.documentElement.classList.add(`theme-${theme}`);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }

        // Save to localStorage
        localStorage.setItem('mindpulse-theme', theme);
    }, [theme]);

    const changeTheme = (newTheme) => setTheme(newTheme);

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
