import { useTheme, Theme } from '@/hooks/use-theme';
import { useSettings } from '@/hooks/use-settings';
import { Settings as SettingsIcon, Palette, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const themes: { id: Theme; name: string; description: string; colors: string[] }[] = [
    { 
      id: 'inferno', 
      name: 'Inferno', 
      description: 'Molten embers and deep charcoal. The flagship CodeFlow experience.',
      colors: ['bg-[#1A1412]', 'bg-[#FF5A36]']
    },
    { 
      id: 'cobalt', 
      name: 'Cobalt', 
      description: 'Cold steel and striking blue. For focused, clinical execution.',
      colors: ['bg-[#0A101A]', 'bg-[#14B8FF]']
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      description: 'Deep violet and striking magenta. Synthwave cybercore vibes.',
      colors: ['bg-[#130A1A]', 'bg-[#D147FF]']
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-8 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">Customize your training environment.</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left group ${
                  theme === t.id 
                    ? 'border-primary bg-primary/5 shadow-[0_0_30px_-10px_hsl(var(--primary))] scale-[1.02]' 
                    : 'border-border glass hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {t.colors.map((c, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full border border-white/20 ${c}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg group-hover:text-primary transition-colors">{t.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-border border-dashed" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {settings.muted ? <VolumeX className="w-6 h-6 text-muted-foreground" /> : <Volume2 className="w-6 h-6 text-primary" />}
            Sound Design
          </h2>
          
          <div className="glass-panel p-6 sm:p-8 rounded-2xl max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">Play mechanical ticks and chimes for keystrokes and completions.</p>
              </div>
              <Switch 
                checked={!settings.muted} 
                onCheckedChange={(checked) => updateSettings({ muted: !checked })}
              />
            </div>

            <div className={`space-y-4 transition-opacity ${settings.muted ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex justify-between">
                <label className="font-bold text-sm">Master Volume</label>
                <span className="text-sm text-muted-foreground font-mono">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={([val]) => updateSettings({ volume: val })}
                className="w-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
