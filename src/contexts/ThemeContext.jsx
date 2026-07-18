import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const setLightMode = () => {
  document.documentElement.classList.remove('dark-mode');
  document.documentElement.style.setProperty('--bg', '#F1F5F9');
  document.documentElement.style.setProperty('--surface', '#FFFFFF');
  document.documentElement.style.setProperty('--text-primary', '#0F172A');
  document.documentElement.style.setProperty('--text-secondary', '#64748B');
  document.documentElement.style.setProperty('--border', '#E2E8F0');
  document.documentElement.style.setProperty('--topbar-bg', '#FFFFFF');
  document.documentElement.style.setProperty('--sidebar-bg', '#0F172A');
  document.documentElement.style.setProperty('--card-bg', '#FFFFFF');
  document.documentElement.style.setProperty('--input-bg', '#F8FAFC');
};

const setDarkMode = () => {
  document.documentElement.classList.add('dark-mode');
  document.documentElement.style.setProperty('--bg', '#0F172A');
  document.documentElement.style.setProperty('--surface', '#1E293B');
  document.documentElement.style.setProperty('--text-primary', '#F8FAFC');
  document.documentElement.style.setProperty('--text-secondary', '#94A3B8');
  document.documentElement.style.setProperty('--border', '#334155');
  document.documentElement.style.setProperty('--topbar-bg', '#1E293B');
  document.documentElement.style.setProperty('--sidebar-bg', '#020617');
  document.documentElement.style.setProperty('--card-bg', '#1E293B');
  document.documentElement.style.setProperty('--input-bg', '#0F172A');
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    if (isDark) {
      setDarkMode();
      localStorage.setItem('theme', 'dark');
    } else {
      setLightMode();
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
