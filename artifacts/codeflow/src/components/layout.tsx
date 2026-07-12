import { Nav } from './nav';
import { SettingsProvider } from '@/hooks/use-settings';
import { ThemeProvider } from '@/hooks/use-theme';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
          <Nav />
          <main className="flex-1 pt-16 flex flex-col">
            {children}
          </main>
        </div>
      </SettingsProvider>
    </ThemeProvider>
  );
}
