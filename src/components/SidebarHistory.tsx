'use client';

import { useEffect, useState } from 'react';
import { RecipePayload } from '@/types/recipe';

interface SidebarHistoryProps {
  onSelectRecipe: (recipe: RecipePayload) => void;
  selectedTitle?: string;
}

export default function SidebarHistory({ onSelectRecipe, selectedTitle }: SidebarHistoryProps) {
  const [history, setHistory] = useState<RecipePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-border bg-card/50 backdrop-blur-sm md:fixed md:left-0 md:top-0 md:z-40">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Recipe History</h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {history.length}
        </span>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
          No recipes yet. Generate your first recipe to see it here.
        </div>
      ) : (
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectRecipe(item)}
              className={`
                group flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left transition-all duration-200
                hover:bg-accent hover:shadow-sm
                ${selectedTitle === item.title ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' : 'text-foreground'}
              `}
            >
              <span className="truncate text-sm font-medium leading-snug">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
              </span>
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}