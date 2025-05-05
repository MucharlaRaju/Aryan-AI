import { GoogleGenAI } from "@google/genai";

let api_key = "AIzaSyDa-63xDzBOcIrlq3CTXP0IB1cBeuFTaP8";

const ai = new GoogleGenAI({ apiKey: api_key });

// Run function to generate AI response
export async function run(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log("AI Response:", response.text);
    return response.text; // Return the AI-generated response
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    throw error; // Re-throw the error for further handling
  }
}