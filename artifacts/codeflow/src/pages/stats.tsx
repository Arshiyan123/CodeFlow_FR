import { useMemo } from 'react';
import { useGetStats, useGetLeaderboard } from '@workspace/api-client-react';
import { getDeviceId } from '@/lib/device-id';
import { computeLocalAggregateStats, getLocalSessions } from '@/lib/local-stats';
import { useBackendStatus } from '@/lib/use-backend-status';
import { Trophy, Flame, Target, Zap, Activity, Clock, ServerOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Stats() {
  const deviceId = getDeviceId();
  const { isOnline } = useBackendStatus();
  
  // Always compute local stats for immediate display
  const localStats = useMemo(() => computeLocalAggregateStats(), []);
  const localSessions = useMemo(() => getLocalSessions(), []);

  // Fetch server stats and leaderboard if online
  const { data: serverStats } = useGetStats({ deviceId }, { query: { enabled: isOnline } });
  const { data: leaderboard } = useGetLeaderboard({ query: { enabled: isOnline } });

  const displayStats = serverStats || localStats;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Performance Stats
        </h1>
        <p className="text-muted-foreground text-lg">Track your progress and compare against the global leaderboard.</p>
        {!isOnline && (
          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg w-fit">
            <ServerOff className="w-4 h-4" />
            Offline Mode: Showing local stats only. Leaderboard unavailable.
          </div>
        )}
      </div>

      {/* Aggregate Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Best WPM" value={displayStats.bestWpm} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Target} label="Avg Accuracy" value={`${displayStats.averageAccuracy}%`} color="text-accent-foreground" bg="bg-accent/10" />
        <StatCard icon={Flame} label="Current Streak" value={`${displayStats.currentStreak} days`} color="text-orange-500" bg="bg-orange-500/10" />
        <StatCard icon={Trophy} label="Total Sessions" value={displayStats.totalSessions} color="text-blue-500" bg="bg-blue-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Recent History */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-muted-foreground" />
            Recent Sessions
          </h2>
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
            {localSessions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No practice sessions recorded yet. Get typing!
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {localSessions.slice(0, 10).map(session => (
                  <div key={session.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{session.problemTitle}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.completedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 font-mono">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">WPM</span>
                        <span className="font-bold text-primary">{session.wpm}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">ACC</span>
                        <span className="font-bold">{session.accuracy}%</span>
                      </div>
                      <div className="text-xs font-bold uppercase px-2 py-1 rounded bg-secondary text-secondary-foreground">
                        {session.language}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Global Leaderboard
          </h2>
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col relative min-h-[300px]">
            {!isOnline ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background/50 backdrop-blur-sm z-10">
                <ServerOff className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">Leaderboard unavailable while offline.</p>
              </div>
            ) : !leaderboard ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No entries yet. Be the first to claim a spot!
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                      i === 1 ? 'bg-zinc-300/20 text-zinc-300' :
                      i === 2 ? 'bg-orange-700/20 text-orange-700' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="font-bold text-foreground">{entry.problemTitle}</span>
                      <span className="text-xs text-muted-foreground uppercase">{entry.language}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <div className="text-right">
                        <div className="font-black text-lg text-primary">{entry.wpm}</div>
                        <div className="text-[10px] text-muted-foreground">WPM</div>
                      </div>
                      <div className="text-right w-12">
                        <div className="font-bold text-accent-foreground">{entry.accuracy}%</div>
                        <div className="text-[10px] text-muted-foreground">ACC</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string | number, color: string, bg: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}
