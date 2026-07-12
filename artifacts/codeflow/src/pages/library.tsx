import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, Filter, BookOpen } from 'lucide-react';
import { PROBLEMS, TOPICS, Difficulty } from '@/data/problems';

export default function Library() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchSearch = search ? p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) : true;
      const matchTopic = selectedTopic ? p.topic === selectedTopic : true;
      const matchDiff = selectedDifficulty ? p.difficulty === selectedDifficulty : true;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [search, selectedTopic, selectedDifficulty]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Problem Library
        </h1>
        <p className="text-muted-foreground text-lg">Select a reference solution to train against.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search problems or tags..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <select 
            value={selectedDifficulty || ''} 
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty || null)}
            className="bg-secondary/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select 
            value={selectedTopic || ''} 
            onChange={(e) => setSelectedTopic(e.target.value || null)}
            className="bg-secondary/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
          >
            <option value="">All Topics</option>
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center glass-panel rounded-2xl">
          <p className="text-muted-foreground">No problems found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((problem, i) => (
            <Link 
              key={problem.id} 
              href={`/practice/${problem.id}`}
              className="glass-panel group rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">{problem.title}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                {problem.summary}
              </p>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{problem.topic}</span>
                <div className="flex gap-1">
                  {problem.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-secondary px-2 py-1 rounded text-secondary-foreground font-mono">
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 2 && (
                    <span className="text-[10px] bg-secondary px-2 py-1 rounded text-secondary-foreground font-mono">
                      +{problem.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
