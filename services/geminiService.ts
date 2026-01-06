
import { GoogleGenAI, Type } from "@google/genai";
import { MediaItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMediaInsights(item: MediaItem) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a media expert. Provide a creative and witty 2-sentence summary/insight for a piece of media titled "${item.title}" by "${item.artist || 'Unknown Artist'}". Mention why a VLC user would enjoy it.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Enjoy your media with VLC's high-quality playback!";
  }
}

export async function getSmartRecommendations(currentTitle: string, history: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is watching "${currentTitle}". History includes: ${history.join(', ')}. Recommend a genre or theme they should explore next.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["recommendation", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { recommendation: "Action", reason: "Keep the momentum going!" };
  }
}
