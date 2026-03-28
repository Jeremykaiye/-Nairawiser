
import { GoogleGenAI, Type } from "@google/genai";
import type { InvestmentAdvice, CashflowForecast, SavingsGoalSuggestion, FinancialHealthScore } from '../types';

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
      model: 'gemini-2.5-pro-preview-0924', // Updated to use a clearer model name if available, keeping existing logic
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
        model: 'gemini-2.5-pro-preview-0924',
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

export const getSavingsSuggestions = async (income: number, spendingBreakdown: any[]): Promise<SavingsGoalSuggestion[] | null> => {
  try {
    const prompt = `You are 'NairaWise', a helpful financial assistant for a Nigerian user living in a city like Lagos. 
    The user has a monthly income of ₦${income.toLocaleString()}. 
    Their spending breakdown is: ${JSON.stringify(spendingBreakdown)}.
    
    Based on this, suggest 3 specific, highly relevant savings goals (Jars) they should start. 
    Consider things like 'Emergency Fund', 'Rent (Annual)', 'Christmas/Detty December', 'Japa Fund', 'Generator/Solar Maintenance', or 'Business Capital'.
    Provide a realistic target amount for each goal based on their income.
    Return the response in JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              targetAmount: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              emoji: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as SavingsGoalSuggestion[];
  } catch (error) {
    console.error("Error getting savings suggestions:", error);
    return null;
  }
};

export const getFinancialHealthScore = async (data: {
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}): Promise<FinancialHealthScore | null> => {
  try {
    const prompt = `You are 'NairaWise', a premier financial health consultant for the Nigerian market. 
    Analyze the following financial data for a user:
    - Monthly Income: ₦${data.income.toLocaleString()}
    - Monthly Expenses: ₦${data.expenses.toLocaleString()}
    - Total Savings: ₦${data.savings.toLocaleString()}
    - Total Investments: ₦${data.investments.toLocaleString()}
    
    Provide a comprehensive financial health score (0-100) and analysis.
    The response must be in JSON format matching this schema:
    {
      "score": number,
      "status": "Poor" | "Fair" | "Good" | "Excellent",
      "breakdown": {
        "incomeVsExpense": number (0-100),
        "savingsRate": number (0-100),
        "investmentDiversification": number (0-100),
        "emergencyFundStatus": number (0-100)
      },
      "tips": string[],
      "aiAnalysis": string
    }
    
    Consider the Nigerian economic context (inflation, exchange rate volatility) in your analysis and tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                incomeVsExpense: { type: Type.NUMBER },
                savingsRate: { type: Type.NUMBER },
                investmentDiversification: { type: Type.NUMBER },
                emergencyFundStatus: { type: Type.NUMBER }
              }
            },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiAnalysis: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as FinancialHealthScore;
  } catch (error) {
    console.error("Error getting financial health score:", error);
    return null;
  }
};
