import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Goal, LessonContent } from "../types";

let ai: GoogleGenAI | null = null;

function getAi() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateLesson(
  targetLanguage: Language,
  level: Level,
  goal: Goal,
  day: number
): Promise<LessonContent> {
  try {
    const genAI = getAi();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // Using a stable model alias
    });
    
    const prompt = `Generate a travel language lesson for Day ${day}.
      Target Language: ${targetLanguage}
      Level: ${level}
      Goal: ${goal}
      
      The lesson should include 5 essential phrases related to the goal.
      Include titles, translations in Korean (source language), pronunciation guides, and brief cultural/grammatical explanations.
      Return the response in valid JSON format.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
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

    const response = await result.response;
    return JSON.parse(response.text()) as LessonContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "학습 내용을 불러오는 중 오류가 발생했습니다",
      phrases: [
        {
          original: "Error",
          translation: "API 키를 확인하거나 잠시 후 다시 시도해주세요.",
          pronunciation: "error",
          explanation: error instanceof Error ? error.message : "입력된 API 키가 유효하지 않거나 할당량이 초과되었을 수 있습니다."
        }
      ],
    };
  }
}
