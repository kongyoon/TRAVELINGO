import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Goal, LessonContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLesson(
  targetLanguage: Language,
  level: Level,
  goal: Goal,
  day: number
): Promise<LessonContent> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate a travel language lesson for Day ${day}.
    Target Language: ${targetLanguage}
    Level: ${level}
    Goal: ${goal}
    
    The lesson should include 5 essential phrases related to the goal.
    Include titles, translations in Korean (source language), pronunciation guides, and brief cultural/grammatical explanations.
    Return the response in valid JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          phrases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                translation: { type: Type.STRING },
                pronunciation: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["original", "translation", "pronunciation", "explanation"],
            },
          },
        },
        required: ["title", "phrases"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as LessonContent;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {
      title: "Error loading lesson",
      phrases: [],
    };
  }
}
