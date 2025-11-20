import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExpenses = async (expenses: Expense[]): Promise<string> => {
  if (expenses.length === 0) {
    return "Por favor, añade algunos gastos para que pueda analizarlos.";
  }

  // Prepare data for the model
  const expenseSummary = expenses.map(e => 
    `- ${e.date}: ${e.description} ($${e.amount}) [${e.category}]`
  ).join('\n');

  const prompt = `
    Actúa como un asesor financiero personal experto y minimalista. 
    Analiza la siguiente lista de gastos recientes de un usuario.
    
    DATOS DE GASTOS:
    ${expenseSummary}
    
    TAREA:
    1. Identifica patrones de gasto preocupantes o categorías dominantes.
    2. Proporciona 3 consejos breves y accionables para ahorrar dinero basados *específicamente* en estos datos.
    3. Mantén un tono amigable, motivador y directo. 
    4. Usa formato Markdown para la respuesta (negritas, listas).
    5. Sé breve. No escribas más de 200 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el análisis en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, hubo un error al conectar con el asistente financiero. Verifica tu conexión o intenta más tarde.";
  }
};