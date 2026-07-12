import { Link, useLocation } from 'wouter';
import { Terminal, Library, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { useBackendStatus } from '@/lib/use-backend-status';

export function Nav() {
  const [location] = useLocation();
  const { isOnline, isChecking } = useBackendStatus();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Terminal className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight text-foreground">CodeFlow</span>
            </Link>
            
            <div className="ml-4 flex items-center">
              {isChecking ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
                </span>
              ) : isOnline ? (
                <span className="flex h-2 w-2 relative" title="Backend Online">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              ) : (
                <span className="flex h-2 w-2 relative" title="Offline Mode (Local Only)">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <NavLink href="/library" icon={Library} label="Library" active={location.startsWith('/library')} />
            <NavLink href="/stats" icon={BarChart2} label="Stats" active={location.startsWith('/stats')} />
            <NavLink href="/settings" icon={SettingsIcon} label="Settings" active={location.startsWith('/settings')} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
