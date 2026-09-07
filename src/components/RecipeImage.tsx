'use client';

import Image from 'next/image';
import { RecipePayload } from '@/types/recipe';

interface RecipeImageProps {
  recipe: RecipePayload | null;
}

export default function RecipeImage({ recipe }: RecipeImageProps) {
  if (!recipe?.imageUri) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-muted/50 lg:h-80">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-muted/30 shadow-lg lg:h-80">
      <Image
        src={recipe.imageUri}
        alt={recipe.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}