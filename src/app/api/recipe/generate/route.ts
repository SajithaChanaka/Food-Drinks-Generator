import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchRecipeFromGemini } from '@/lib/gemini';
import { fetchFoodImage } from '@/lib/pexels';
import { fetchYouTubeVideoId } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawQuery = typeof body.query === 'string' ? body.query.trim() : '';

    if (!rawQuery) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    
     const sanitized = rawQuery.replace(/[^a-zA-Z0-9\s\-',.!()]/g, '').slice(0, 200);

    if (!sanitized) {
      return NextResponse.json({ error: 'Invalid query after sanitization' }, { status: 400 });
    }

   
      const cached = await prisma.recipe.findFirst({
      where: {
        title: {
          equals: sanitized,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        imageUri: true,
        ingredients: true,
        instructions: true,
        youtubeVideoId: true,
        createdAt: true,
      },
    });

      if (cached) {
      return NextResponse.json({
        id: cached.id,
        title: cached.title,
        imageUri: cached.imageUri,
        ingredients: cached.ingredients,
        instructions: cached.instructions,
        youtubeVideoId: cached.youtubeVideoId ?? null,
        createdAt: cached.createdAt.toISOString(),
        cached: true,
      });
    }

    
      const [geminiData, imageUri, youtubeVideoId] = await Promise.all([
      fetchRecipeFromGemini(sanitized).catch((err) => {
        console.error('Gemini error:', err);
        throw new Error('Failed to generate recipe from Gemini');
      }),
      fetchFoodImage(sanitized).catch((err) => {
        console.error('Pexels error:', err);
        throw new Error('Failed to fetch food image');
      }),
      fetchYouTubeVideoId(sanitized).catch((err) => {
        console.error('YouTube error:', err);
        return null; 
      }),
    ]);

      const newRecipe = await prisma.recipe.create({
      data: {
        title: geminiData.title,
        imageUri,
        ingredients: geminiData.ingredients,
        instructions: geminiData.instructions,
        youtubeVideoId: youtubeVideoId ?? undefined,
      },
      select: {
        id: true,
        title: true,
        imageUri: true,
        ingredients: true,
        instructions: true,
        youtubeVideoId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      id: newRecipe.id,
      title: newRecipe.title,
      imageUri: newRecipe.imageUri,
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
      youtubeVideoId: newRecipe.youtubeVideoId ?? null,
      createdAt: newRecipe.createdAt.toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error('Generate recipe error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}