import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const userSelected = localStorage.getItem('mindpulse-theme-user-selected');
            const saved = localStorage.getItem('mindpulse-theme');
            if (userSelected === 'true' && (saved === 'dark' || saved === 'light')) {
                return saved;
            }
        } catch (e) {
            console.error('Error reading theme from localStorage', e);
        }
        return 'light';
    });

    useEffect(() => {
        try {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('mindpulse-theme', theme);
        } catch (e) {
            console.error('Error saving theme to localStorage', e);
        }
    }, [theme]);

    const changeTheme = (newTheme) => {
        try {
            localStorage.setItem('mindpulse-theme-user-selected', 'true');
        } catch (e) {
            console.error('Error updating theme selection flag', e);
        }
        setTheme(newTheme);
    };

    const toggleTheme = () => {
        changeTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

