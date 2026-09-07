'use client';

interface YouTubeEmbedProps {
  videoId: string | null | undefined;
}

export default function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  if (!videoId) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        No tutorial video found for this recipe.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/50 shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Recipe tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}