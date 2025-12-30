
import { GoogleGenAI } from "@google/genai";

// Always initialize with named parameters and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFamilyData = async (familyData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikut adalah data Kartu Keluarga: ${JSON.stringify(familyData)}. 
      Berikan ringkasan singkat tentang demografi keluarga ini dalam bahasa Indonesia yang ramah. 
      Sebutkan jumlah anggota, sebaran umur, dan status pendidikan secara singkat saja.`
    });
    // Use .text property for string output as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten AI sedang tidak dapat menjangkau data saat ini.";
  }
};
