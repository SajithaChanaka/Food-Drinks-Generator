import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipePayload } from '@/types/recipe';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        imageUri: true,
        createdAt: true,
        ingredients: true,
        instructions: true,
        youtubeVideoId: true,
      },
    });

    const mapped: RecipePayload[] = recipes.map((r) => ({
      id: r.id,
      title: r.title,
      imageUri: r.imageUri,
      createdAt: r.createdAt.toISOString(),
      ingredients: r.ingredients as RecipePayload['ingredients'],
      instructions: r.instructions as RecipePayload['instructions'],
      youtubeVideoId: r.youtubeVideoId ?? undefined,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe history' },
      { status: 500 }
    );
  }
}
