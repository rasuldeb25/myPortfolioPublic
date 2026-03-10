import { GoogleGenAI } from "@google/genai";
import { RESUME_SUMMARY } from "../constants";

export const getGeminiResponse = async (userQuestion: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key is missing. Please configure the environment variable.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash model for quick Q&A
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: You are an AI assistant for a personal portfolio website. 
      The owner of the website has the following background: ${RESUME_SUMMARY}.
      
      User Question: ${userQuestion}
      
      Answer briefly and professionally in the first person (as if you are the owner's digital avatar).`,
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};