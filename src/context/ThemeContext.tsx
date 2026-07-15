"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Accent = 'blue' | 'red' | 'orange' | 'green' | 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  accent: Accent;
  highContrast: boolean;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  setHighContrast: (c: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [accent, setAccentState] = useState<Accent>('blue');
  const [highContrast, setHighContrastState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedTheme = localStorage.getItem('app-theme') as Theme || 'system';
    const savedAccent = localStorage.getItem('app-accent') as Accent || 'blue';
    const savedContrast = localStorage.getItem('app-contrast') === 'true';

    setThemeState(savedTheme);
    setAccentState(savedAccent);
    setHighContrastState(savedContrast);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Resolve system theme
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', effectiveTheme);
    root.setAttribute('data-accent', accent);
    if (highContrast) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-accent', accent);
    localStorage.setItem('app-contrast', highContrast.toString());

  }, [theme, accent, highContrast, mounted]);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, accent, highContrast, setTheme: setThemeState, setAccent: setAccentState, setHighContrast: setHighContrastState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
