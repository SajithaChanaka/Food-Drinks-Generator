'use client';

import { RecipePayload } from '@/types/recipe';
import { ListChecks } from 'lucide-react';

interface InstructionsListProps {
  recipe: RecipePayload | null;
}

  export default function InstructionsList({ recipe }: InstructionsListProps) {
  if (!recipe) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        Step-by-step instructions will appear here after generating a recipe.
      </div>
    );
  }

    return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <ListChecks className="h-5 w-5 text-primary" />
        Instructions
      </h3>
      <ol className="space-y-4">
        {recipe.instructions.map((step, idx) => (
          <li key={idx} className="flex items-start gap-4 text-sm text-foreground/90">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
              {idx + 1}
            </span>
             <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}