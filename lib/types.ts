export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  author: string;
  created_at: string;
  image_url?: string | null;
}
