
import { GoogleGenAI, Type } from "@google/genai";
import type { InvestmentAdvice, CashflowForecast } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll rely on the environment variable being set.
  console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getInvestmentAdvice = async (riskProfile: string, goals: string, age: number): Promise<InvestmentAdvice | null> => {
  try {
    const prompt = `You are 'NairaWise', an expert financial advisor for the Nigerian market. A user has the following profile: Risk Tolerance: ${riskProfile}, Financial Goals: '${goals}', Age: ${age}. Based on this, create a personalized investment roadmap. Recommend a mix of Nigerian investment options like Treasury Bills, FGN Bonds, stocks on the NGX, and real estate. Explain your reasoning in a clear, encouraging tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategySummary: { type: Type.STRING },
            assetAllocation: {
              type: Type.OBJECT,
              properties: {
                stocks: { type: Type.NUMBER },
                bonds: { type: Type.NUMBER },
                realEstate: { type: Type.NUMBER },
                agriTech: { type: Type.NUMBER },
                cash: { type: Type.NUMBER },
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as InvestmentAdvice;
  } catch (error) {
    console.error("Error getting investment advice:", error);
    return null;
  }
};

export const getCashflowForecast = async (pastData: string): Promise<CashflowForecast | null> => {
  try {
    const prompt = `You are 'NairaWise', a business financial analyst specializing in Nigerian SMEs. Based on the following historical monthly data, provide a 3-month cashflow forecast. Highlight potential shortfalls or surpluses and give one actionable tip. Data: ${pastData}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    forecast: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                month: { type: Type.STRING },
                                predictedIncome: { type: Type.NUMBER },
                                predictedExpense: { type: Type.NUMBER }
                            }
                        }
                    },
                    analysis: { type: Type.STRING }
                }
            }
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as CashflowForecast;
  } catch (error)
  {
    console.error("Error getting cashflow forecast:", error);
    return null;
  }
};
