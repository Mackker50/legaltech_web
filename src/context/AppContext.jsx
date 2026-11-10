'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('th');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('lang');
    if (savedTheme === 'dark') setIsDark(true);
    if (savedLang) setLang(savedLang);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleLang = () => {
    const newLang = lang === 'th' ? 'en' : 'th';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // ชุดสี Theme แบบ Global นำไปใช้กับ Component อื่นๆ ได้เลย
  const theme = {
    bg: isDark ? '#000000' : '#f5f5f7',
    cardBg: isDark ? '#1c1c1e' : '#ffffff',
    textMain: isDark ? '#f5f5f7' : '#1d1d1f',
    textSub: isDark ? '#a1a1a6' : '#86868b',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    inputBorder: isDark ? '#38383a' : '#d2d2d7',
    inputBg: isDark ? '#1c1c1e' : '#ffffff',
    shadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.04)',
    link: isDark ? '#2997ff' : '#0071e3',
  };

  if (!mounted) return null; // ป้องกัน Hydration Error

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, lang, toggleLang, theme }}>
      {/* Wrapper หลักที่ครอบทั้งแอป เพื่อปรับพื้นหลังและสีอักษรพื้นฐานอัตโนมัติ */}
      <div 
        style={{ 
          backgroundColor: theme.bg, 
          color: theme.textMain, 
          minHeight: '100vh', 
          transition: 'background-color 0.3s ease, color 0.3s ease' 
        }}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

// Custom Hook สำหรับเรียกใช้ Context ง่ายๆ
export function useAppContext() {
  return useContext(AppContext);
}