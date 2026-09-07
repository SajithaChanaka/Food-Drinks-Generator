import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const RECIPE_PROMPT = `You are a professional chef and recipe generator. 
Generate a complete, detailed recipe card for the following food or drink item: "{{query}}".

Respond ONLY with valid JSON matching this exact schema, nothing else:
{
  "title": "String",
  "ingredients": [{"name": "String", "amount": "String"}],
  "instructions": ["String"]
}

Rules:
- title must be the exact dish/drink name
- ingredients must be an array of objects with "name" and "amount" fields
- instructions must be an array of step-by-step strings
- Return ONLY raw JSON, no markdown block, no commentary
`;

export async function fetchRecipeFromGemini(query: string): Promise<{
  title: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
}> {
  const prompt = RECIPE_PROMPT.replace('{{query}}', query);
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Strip markdown fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}