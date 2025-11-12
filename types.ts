
export enum AppView {
  Dashboard,
  Learn,
  Invest,
  Track,
  Pro,
  Pricing
}

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export interface SavingsJar {
  id: string;
  name: string;
  currentAmount: number;
  goalAmount: number;
  emoji: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string; // full content for the module
}

export interface InvestmentOpportunity {
  id: string;
  name: string;
  type: 'Stocks' | 'Real Estate' | 'AgriTech' | 'Bonds';
  expectedReturn: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface InvestmentAdvice {
  strategySummary: string;
  assetAllocation: { [key: string]: number };
  recommendations: Array<{
    name: string;
    description: string;
  }>;
}

export interface CashflowForecast {
    forecast: Array<{
        month: string;
        predictedIncome: number;
        predictedExpense: number;
    }>;
    analysis: string;
}
