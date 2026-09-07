export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipePayload {
  id?: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUri?: string;
  youtubeVideoId?: string;
  createdAt?: string;
}
