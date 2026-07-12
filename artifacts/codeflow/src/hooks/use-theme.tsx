import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'inferno' | 'cobalt' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('codeflow:theme') as Theme) || 'inferno';
    }
    return 'inferno';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-inferno', 'theme-cobalt', 'theme-neon');
    root.classList.add(`theme-${theme}`);
    // Always use dark mode variants for tailwind
    root.classList.add('dark');
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('codeflow:theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
