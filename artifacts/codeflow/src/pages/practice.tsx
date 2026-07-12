import { useState, useEffect, useRef, useMemo } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { getProblemById, Language, LANGUAGE_LABELS } from '@/data/problems';
import { evaluateTyped, computeSessionStats, computeStrictMask, isHorizontalSpace, SessionStats } from '@/lib/typing-engine';
import { useAudio } from '@/hooks/use-audio';
import { saveLocalSession } from '@/lib/local-stats';
import { getDeviceId } from '@/lib/device-id';
import { useCreateSession } from '@workspace/api-client-react';
import { useBackendStatus } from '@/lib/use-backend-status';
import { RotateCcw, ChevronRight, Play, CheckCircle2, Zap, Target, Timer, Hash } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface WpmSample {
  t: number; // seconds elapsed
  wpm: number;
  raw: number;
}

const resultsChartConfig = {
  wpm: { label: 'WPM', color: 'hsl(var(--primary))' },
  raw: { label: 'Raw', color: 'hsl(var(--accent-foreground))' },
} satisfies ChartConfig;

export default function Practice() {
  const [, params] = useRoute('/practice/:id');
  const [, setLocation] = useLocation();
  const problem = useMemo(() => getProblemById(params?.id || ''), [params?.id]);
  
  const [language, setLanguage] = useState<Language>('cpp');
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<WpmSample[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const finalStatsRef = useRef<SessionStats | null>(null);
  
  const { playCorrect, playIncorrect, playComplete } = useAudio();
  const { isOnline } = useBackendStatus();
  const createSession = useCreateSession();

  const reference = problem ? problem.solutions[language].code : '';
  const strictMask = useMemo(() => reference ? computeStrictMask(reference) : [], [reference]);
  const evaluation = useMemo(() => evaluateTyped(reference, typed, strictMask), [reference, typed, strictMask]);
  
  const stats = useMemo(() => {
    const elapsedMs = startTime ? (endTime || Date.now()) - startTime : 0;
    return computeSessionStats(evaluation.results, elapsedMs);
  }, [evaluation.results, startTime, endTime]);

  // Handle completion
  useEffect(() => {
    if (evaluation.isComplete && !endTime && startTime && problem) {
      const now = Date.now();
      setEndTime(now);
      playComplete();
      
      const sessionStats = computeSessionStats(evaluation.results, now - startTime);
      finalStatsRef.current = sessionStats;
      setHistory(prev => [...prev, { t: Math.round((now - startTime) / 1000), wpm: sessionStats.wpm, raw: sessionStats.rawWpm }]);
      
      // Save locally first
      saveLocalSession({
        problemId: problem.id,
        problemTitle: problem.title,
        language,
        wpm: sessionStats.wpm,
        accuracy: sessionStats.accuracy,
        durationSeconds: Math.round((now - startTime) / 1000),
        completedAt: new Date().toISOString(),
      });

      // Sync to server if online
      if (isOnline) {
        createSession.mutate({
          data: {
            deviceId: getDeviceId(),
            problemId: problem.id,
            problemTitle: problem.title,
            language,
            wpm: sessionStats.wpm,
            accuracy: sessionStats.accuracy,
            durationSeconds: Math.round((now - startTime) / 1000),
          }
        });
      }
    }
  }, [evaluation.isComplete, endTime, startTime, problem, language, evaluation.results, isOnline, createSession, playComplete]);

  // Handle keyboard events via a hidden textarea to get mobile support and proper event handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evaluation.isComplete) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      handleInput('    '); // 4 spaces for tab
    }
  };

  const handleInput = (newChar: string) => {
    if (evaluation.isComplete) return;
    if (!startTime) setStartTime(Date.now());
    
    setTyped(prev => {
      let next = prev + newChar;

      // Auto-indent: once Enter is pressed, immediately fill in the
      // reference's leading indentation for the new line. Indentation is
      // still fully enforced (we insert the exact reference whitespace,
      // nothing looser), but the caret now lands right where the next real
      // character starts instead of the far left, like a real code editor.
      if (newChar.includes('\n')) {
        const afterNewline = evaluateTyped(reference, next, strictMask);
        let pos = afterNewline.refPos;
        while (pos < reference.length && isHorizontalSpace(reference[pos]) && strictMask[pos]) {
          next += reference[pos];
          pos++;
        }
      }

      // Evaluate just to get the audio feedback right now
      const currentEval = evaluateTyped(reference, next, strictMask);
      const lastChar = currentEval.results[currentEval.results.length - 1];
      if (lastChar) {
        if (lastChar.status === 'correct' || lastChar.status === 'extra') {
          playCorrect();
        } else {
          playIncorrect();
        }
      }
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (evaluation.isComplete) return;
    
    // Determine if it was a backspace or typed text
    if (val.length < typed.length) {
      setTyped(val);
    } else {
      const newChars = val.slice(typed.length);
      handleInput(newChars);
    }
  };

  const reset = () => {
    setTyped('');
    setStartTime(null);
    setEndTime(null);
    setHistory([]);
    finalStatsRef.current = null;
    if (inputRef.current) inputRef.current.focus();
  };

  if (!problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
        <Link href="/library" className="text-primary hover:underline">Return to Library</Link>
      </div>
    );
  }

  // Force re-render of timer every second while active, and sample WPM/raw
  // for the results graph so the completion screen can show progress over
  // time, Monkeytype-style.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        setTick(t => t + 1);
        const elapsedMs = Date.now() - startTime;
        const sample = computeSessionStats(evaluateTyped(reference, typed, strictMask).results, elapsedMs);
        setHistory(prev => [...prev, { t: Math.round(elapsedMs / 1000), wpm: sample.wpm, raw: sample.rawWpm }]);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [startTime, endTime, reference, typed, strictMask]);

  return (
    <div className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 sm:p-8" onClick={() => inputRef.current?.focus()}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/library" className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </Link>
            <span className="text-muted-foreground text-sm border-l border-border pl-3">{problem.topic}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {problem.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass px-2 rounded-lg flex items-center p-1">
            {(['cpp', 'java', 'python'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={(e) => { e.stopPropagation(); setLanguage(lang); reset(); }}
                disabled={startTime !== null && !endTime}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                  language === lang 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); reset(); }}
            className="p-2.5 rounded-lg glass text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 group"
            title="Restart (Tab + Enter)"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-8 mb-6 font-mono border-y border-white/5 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">WPM</span>
          <span className="text-2xl font-bold text-primary">{stats.wpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Accuracy</span>
          <span className="text-2xl font-bold text-accent-foreground">{stats.accuracy}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Time</span>
          <span className="text-2xl font-bold text-foreground">
            {startTime ? Math.floor(((endTime || Date.now()) - startTime) / 1000) : 0}s
          </span>
        </div>
      </div>

      {/* Typing Area */}
      <div className="relative flex-1 rounded-2xl glass-panel p-6 sm:p-10 overflow-hidden font-mono text-lg sm:text-xl leading-[1.6] whitespace-pre-wrap shadow-2xl transition-all duration-300">
        
        {/* Hidden textarea for input capture */}
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 opacity-0 pointer-events-none resize-none"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />

        {/* Focus Warning Overlay */}
        {!isFocused && !evaluation.isComplete && (
          <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/50 flex items-center justify-center transition-all">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-white/10 shadow-xl animate-in zoom-in-95 duration-200">
              <Play className="w-5 h-5 text-primary" />
              <span className="font-sans font-bold text-lg">Click or press any key to focus</span>
            </div>
          </div>
        )}

        {/* Results Overlay */}
        {evaluation.isComplete && (() => {
          const finalStats = finalStatsRef.current ?? stats;
          const chartData = history.length > 1 ? history : [{ t: 0, wpm: finalStats.wpm, raw: finalStats.rawWpm }, ...history];
          return (
            <div className="absolute inset-0 z-30 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-500">
              <div className="p-6 sm:p-8 glass-panel rounded-3xl max-w-2xl w-full space-y-6 animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center ring-2 ring-primary/40 ring-offset-4 ring-offset-background">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Run Complete!</h2>
                    <p className="text-muted-foreground font-sans text-sm">You crushed the {LANGUAGE_LABELS[language]} solution.</p>
                  </div>
                </div>

                {/* Headline WPM + Accuracy, Monkeytype-style */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                    <div className="text-4xl font-black text-primary mb-1">{finalStats.wpm}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-bold flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> WPM</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                    <div className="text-4xl font-black text-foreground/70 mb-1">{finalStats.rawWpm}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-bold flex items-center justify-center gap-1"><Hash className="w-3 h-3" /> Raw</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                    <div className="text-4xl font-black text-accent-foreground mb-1">{finalStats.accuracy}%</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-bold flex items-center justify-center gap-1"><Target className="w-3 h-3" /> Accuracy</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                    <div className="text-4xl font-black text-foreground/70 mb-1">
                      {startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0}s
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-bold flex items-center justify-center gap-1"><Timer className="w-3 h-3" /> Time</div>
                  </div>
                </div>

                {/* WPM over time graph */}
                <div className="bg-secondary/30 rounded-xl border border-white/5 p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-sans font-bold mb-2">Performance</div>
                  <ChartContainer config={resultsChartConfig} className="h-[180px] w-full aspect-auto">
                    <AreaChart data={chartData} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillWpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-wpm)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-wpm)" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="fillRaw" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-raw)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--color-raw)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-20" />
                      <XAxis dataKey="t" tickFormatter={(v) => `${v}s`} tickLine={false} axisLine={false} fontSize={11} />
                      <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
                      <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => `${v}s`} />} />
                      <Area dataKey="raw" type="monotone" fill="url(#fillRaw)" stroke="var(--color-raw)" strokeWidth={2} />
                      <Area dataKey="wpm" type="monotone" fill="url(#fillWpm)" stroke="var(--color-wpm)" strokeWidth={2.5} />
                    </AreaChart>
                  </ChartContainer>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="flex-1 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-sans font-bold hover:bg-secondary/80 transition-colors"
                  >
                    Restart Run
                  </button>
                  <Link 
                    href="/library"
                    className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-sans font-bold hover:bg-primary/90 transition-colors inline-block text-center"
                  >
                    Next Problem
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

        {/* The code renderer */}
        <div className="relative z-10 break-all select-none">
          {evaluation.results.map((r, i) => (
            <span key={i} className={
              r.status === 'correct' ? 'text-primary' :
              r.status === 'incorrect' ? 'text-destructive bg-destructive/20 rounded-sm' :
              'text-destructive underline decoration-wavy decoration-destructive/50'
            }>{r.char}</span>
          ))}
          
          {/* Caret */}
          {isFocused && !evaluation.isComplete && (
            <span className="caret-blink absolute w-[2px] h-[1.2em] bg-primary -ml-[1px] translate-y-[0.15em] shadow-[0_0_8px_hsl(var(--primary))]" />
          )}

          {/* Reference Ghost Text */}
          <span className="opacity-25 text-foreground transition-opacity">
            {reference.slice(evaluation.refPos)}
          </span>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 glass-panel p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Complexity</h3>
          <div className="flex gap-6 font-mono text-lg">
            <div>
              <span className="text-muted-foreground mr-2">Time:</span>
              <span className="text-foreground">{problem.solutions[language].timeComplexity}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">Space:</span>
              <span className="text-foreground">{problem.solutions[language].spaceComplexity}</span>
            </div>
          </div>
        </div>
        <div className="flex-[2] glass-panel p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Explanation</h3>
          <p className="text-foreground leading-relaxed">{problem.explanation}</p>
        </div>
      </div>
    </div>
  );
}
