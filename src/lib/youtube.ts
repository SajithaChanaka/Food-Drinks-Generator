if (!process.env.YOUTUBE_API_KEY) {
  throw new Error('YOUTUBE_API_KEY is not defined in environment variables');
}

const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

export async function fetchYouTubeVideoId(recipeTitle: string): Promise<string | null> {
  const query = encodeURIComponent(`${recipeTitle} recipe tutorial`);
  const res = await fetch(
    `${YOUTUBE_BASE}/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return data.items[0].id.videoId;
}