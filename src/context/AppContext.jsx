'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('th');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // ดึง Session จาก localStorage ตอนเริ่มต้น
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session') || localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }, []);

  const login = (userData) => {
    const sessionUser = userData || { name: 'Thitipong L.', email: 'thitipong@agrilegal.pro', role: 'EXPORTER' };
    setUser(sessionUser);
    localStorage.setItem('user_session', JSON.stringify(sessionUser));
    localStorage.setItem('user', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
  };

  const theme = {
    bg: isDarkMode ? '#0d0d0e' : '#f5f5f7',
    cardBg: isDarkMode ? '#1c1c1e' : '#ffffff',
    textMain: isDarkMode ? '#f5f5f7' : '#1d1d1f',
    textSub: isDarkMode ? '#8e8e93' : '#86868b',
    border: isDarkMode ? '#2c2c2e' : '#e5e5ea',
    inputBg: isDarkMode ? '#2c2c2e' : '#fafafa',
    inputBorder: isDarkMode ? '#3a3a3c' : '#d2d2d7',
    link: '#0071e3',
    linkHover: '#0077ed',
    shadow: isDarkMode ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.04)',
    glassBg: isDarkMode ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  };

  return (
    <AppContext.Provider value={{ lang, setLang, isDarkMode, setIsDarkMode, theme, user, login, logout }}>
      <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}