'use client';

import { RecipePayload } from '@/types/recipe';
import { CheckCircle2 } from 'lucide-react';

interface IngredientsChecklistProps {
  recipe: RecipePayload | null;
}

export default function IngredientsChecklist({ recipe }: IngredientsChecklistProps) {
  if (!recipe) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        Ingredients will appear here after generating a recipe.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        Ingredients
      </h3>
      <ul className="space-y-3">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>
            <div className="flex-1">
              <span className="font-medium text-foreground">{ing.name}</span>
              {ing.amount && (
                <span className="ml-1 text-muted-foreground">— {ing.amount}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}