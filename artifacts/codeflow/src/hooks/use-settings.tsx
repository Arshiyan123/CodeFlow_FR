import { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  volume: number;
  muted: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  volume: 0.5,
  muted: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codeflow:settings');
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) };
        } catch {
          // ignore
        }
      }
    }
    return defaultSettings;
  });

  const updateSettings = (updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('codeflow:settings', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
