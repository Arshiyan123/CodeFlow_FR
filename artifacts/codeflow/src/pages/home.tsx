import { Link } from 'wouter';
import { Terminal, ArrowRight, Shuffle, TrendingUp } from 'lucide-react';
import { getLocalSessions } from '@/lib/local-stats';
import { PROBLEMS } from '@/data/problems';
import { useMemo } from 'react';

export default function Home() {
  const lastSession = useMemo(() => {
    const sessions = getLocalSessions();
    return sessions.length > 0 ? sessions[0] : null;
  }, []);

  const randomProblem = useMemo(() => {
    return PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="max-w-3xl w-full space-y-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary mb-4 ring-1 ring-primary/20">
            <Terminal className="w-12 h-12" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter">
            Build Muscle Memory.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Crush Interviews.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A high-intensity typing dojo for elite programmers. Type reference solutions perfectly, watch your WPM climb, and lock the patterns into your hands.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {lastSession ? (
            <Link href={`/practice/${lastSession.problemId}`} className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-primary-foreground bg-primary rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-15px_hsl(var(--primary))]">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Jump Back In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link href="/library" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-primary-foreground bg-primary rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-15px_hsl(var(--primary))]">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Start Training</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          <Link href={`/practice/${randomProblem.id}`} className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-foreground glass rounded-xl hover:bg-white/10 transition-colors hover:scale-105 active:scale-95">
            <Shuffle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span>Random Drill</span>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Strict Enforcement</h3>
            <p className="text-sm text-muted-foreground">Whitespace between tokens is flexible, but indentation and newlines must be character-perfect.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Live Analytics</h3>
            <p className="text-sm text-muted-foreground">Real-time WPM and accuracy tracking. Every keystroke is measured, pushing you to type faster.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-secondary-foreground">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Curated Library</h3>
            <p className="text-sm text-muted-foreground">24 hand-picked, essential patterns spanning dynamic programming to sliding windows.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
