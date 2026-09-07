'use client';

import { useState, useCallback } from 'react';
import { RecipePayload } from '@/types/recipe';
import SearchBar from '@/components/SearchBar';
import RecipeImage from '@/components/RecipeImage';
import IngredientsChecklist from '@/components/IngredientsChecklist';
import InstructionsList from '@/components/InstructionsList';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import ErrorBanner from '@/components/ErrorBanner';
import SidebarHistory from '@/components/SidebarHistory';

export default function Home() {
  const [recipe, setRecipe] = useState<RecipePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Unexpected response (${res.status}): ${text.slice(0, 200)}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      setRecipe({
        id: data.id,
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        imageUri: data.imageUri,
        youtubeVideoId: data.youtubeVideoId,
        createdAt: data.createdAt,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectHistory = useCallback((item: RecipePayload) => {
    setRecipe(item);
    setError(null);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDismissError = useCallback(() => setError(null), []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar - Historical Tracking Panel */}
      <SidebarHistory onSelectRecipe={handleSelectHistory} selectedTitle={recipe?.title} />

      {/* Right Main Panel - Interactive Dashboard */}
      <main className="flex-1 md:ml-72">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Search / Input Bar */}
          <section className="mb-10">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Food & Drink Recipe Generator
            </h1>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              Enter any dish or drink name. We&apos;ll generate a complete recipe card,
              find a matching image, and locate a video tutorial — all powered by AI.
            </p>
            <SearchBar onSearch={handleGenerate} isLoading={loading} />
          </section>

          {/* Error Banner */}
          <ErrorBanner message={error} onDismiss={handleDismissError} />

          {/* Recipe Content */}
          {recipe ? (
            <div className="space-y-8">
              {/* Title + Image split grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                    {recipe.title}
                  </h2>
                </div>
                <RecipeImage recipe={recipe} />
              </div>

              {/* Ingredients + Instructions split grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <IngredientsChecklist recipe={recipe} />
                <InstructionsList recipe={recipe} />
              </div>

              {/* YouTube Video Embed */}
              <section className="pt-4">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Video Tutorial</h3>
                <YouTubeEmbed videoId={recipe.youtubeVideoId} />
              </section>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <p className="text-center text-sm text-muted-foreground sm:text-base">
                Your generated recipe will appear here.
                <br />
                Start by searching for a dish above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
