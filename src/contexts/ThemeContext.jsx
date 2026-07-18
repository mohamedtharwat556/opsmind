import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const isDark = false;
  const toggleTheme = () => {};

  useEffect(() => {
    // Always set light mode
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.style.setProperty('--bg-primary', '#ffffff');
    document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
    document.documentElement.style.setProperty('--text-primary', '#0f172a');
    document.documentElement.style.setProperty('--text-secondary', '#475569');
    document.documentElement.style.setProperty('--border', '#e2e8f0');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
