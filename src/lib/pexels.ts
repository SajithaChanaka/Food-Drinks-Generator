if (!process.env.PEXELS_API_KEY) {
  throw new Error('PEXELS_API_KEY is not defined in environment variables');
}

const PEXELS_BASE = 'https://api.pexels.com/v1';

export async function fetchFoodImage(recipeTitle: string): Promise<string> {
  const res = await fetch(`${PEXELS_BASE}/search?query=${encodeURIComponent(recipeTitle)} food&per_page=1&orientation=landscape`, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Pexels API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.photos || data.photos.length === 0) {
    throw new Error('No photos found from Pexels');
  }

  return data.photos[0].src.large;
}