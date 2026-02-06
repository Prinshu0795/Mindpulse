import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('classic'); // 'classic', 'midnight', 'forest', 'rose'

    useEffect(() => {
        // Remove all theme classes first
        const themes = ['classic', 'midnight', 'forest', 'rose'];
        themes.forEach(t => document.documentElement.classList.remove(`theme-${t}`));

        // Add current theme class
        document.documentElement.classList.add(`theme-${theme}`);

        // Also handle standard 'dark' class for basic tailwind compatibility if needed
        if (theme === 'midnight') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const changeTheme = (newTheme) => setTheme(newTheme);

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
