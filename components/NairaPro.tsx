
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { getCashflowForecast, getFinancialHealthScore } from '../services/geminiService';
import type { CashflowForecast, FinancialHealthScore } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ICONS } from '../constants';

const NairaPro: React.FC = () => {
  // Cashflow Predictor State
  const [pastData, setPastData] = useState(
`[
  {"month": "April", "income": 500000, "expense": 350000},
  {"month": "May", "income": 650000, "expense": 400000},
  {"month": "June", "income": 580000, "expense": 420000}
]`
  );
  const [forecast, setForecast] = useState<CashflowForecast | null>(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  // Financial Health Score State
  const [healthData, setHealthData] = useState({
    income: 450000,
    expenses: 280000,
    savings: 1200000,
    investments: 500000
  });
  const [healthScore, setHealthScore] = useState<FinancialHealthScore | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  const handleGetForecast = async () => {
    setIsForecastLoading(true);
    setForecastError(null);
    setForecast(null);
    try {
        JSON.parse(pastData);
    } catch (e) {
        setForecastError("Invalid JSON format in historical data.");
        setIsForecastLoading(false);
        return;
    }

    const result = await getCashflowForecast(pastData);
    if (result) {
      setForecast(result);
    } else {
      setForecastError('Could not generate cashflow forecast. Please try again.');
    }
    setIsForecastLoading(false);
  };

  const handleGetHealthScore = async () => {
    setIsHealthLoading(true);
    setHealthError(null);
    setHealthScore(null);
    
    const result = await getFinancialHealthScore(healthData);
    if (result) {
      setHealthScore(result);
    } else {
      setHealthError('Could not calculate health score. Please try again.');
    }
    setIsHealthLoading(false);
  };
  
  const chartData = forecast?.forecast.map(f => ({
    name: f.month,
    Income: f.predictedIncome,
    Expense: f.predictedExpense,
    Net: f.predictedIncome - f.predictedExpense
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">NairaPro</h1>
          <p className="text-gray-500 mt-1">Powerful tools for your business or freelance hustle.</p>
        </div>
        <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">PREMIUM</span>
      </header>

      {/* AI Financial Health Score */}
      <Card className="border-t-4 border-green-600">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            {ICONS.health}
          </div>
          <h2 className="text-2xl font-bold text-gray-700">AI Financial Health Score</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Your Financial Data</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Monthly Income (₦)</label>
              <input 
                type="number" 
                value={healthData.income}
                onChange={(e) => setHealthData({...healthData, income: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Monthly Expenses (₦)</label>
              <input 
                type="number" 
                value={healthData.expenses}
                onChange={(e) => setHealthData({...healthData, expenses: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Savings (₦)</label>
              <input 
                type="number" 
                value={healthData.savings}
                onChange={(e) => setHealthData({...healthData, savings: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Investments (₦)</label>
              <input 
                type="number" 
                value={healthData.investments}
                onChange={(e) => setHealthData({...healthData, investments: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <Button onClick={handleGetHealthScore} isLoading={isHealthLoading} className="w-full">
              Analyze My Health
            </Button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {healthError && <p className="text-red-500">{healthError}</p>}
            
            {healthScore ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Overall Score</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-black text-gray-800">{healthScore.score}</span>
                      <span className="text-xl font-bold text-gray-400">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Status</p>
                    <p className={`text-2xl font-black ${getStatusColor(healthScore.status)}`}>{healthScore.status}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${getScoreColor(healthScore.score)}`}
                    style={{ width: `${healthScore.score}%` }}
                  ></div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(healthScore.breakdown).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-lg font-bold text-gray-700">{val}%</p>
                    </div>
                  ))}
                </div>

                {/* AI Analysis */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <h4 className="font-bold text-green-800 flex items-center mb-2">
                    <span className="mr-2">✨</span> AI Analysis
                  </h4>
                  <p className="text-green-700 text-sm leading-relaxed italic">
                    "{healthScore.aiAnalysis}"
                  </p>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Actionable Tips</h4>
                  <ul className="space-y-2">
                    {healthScore.tips.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-gray-600">
                        <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  {ICONS.health}
                </div>
                <h3 className="text-lg font-bold text-gray-400">Ready for Analysis</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
                  Enter your financial data and let our AI calculate your health score and provide personalized tips.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Cashflow Predictor</h2>
        <p className="text-gray-600 mb-6">
          Use Gemini's AI to forecast your cashflow based on historical data. Enter your past income and expenses in the JSON format below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pastData" className="block text-sm font-medium text-gray-700 mb-2">
              Historical Data (JSON)
            </label>
            <textarea
              id="pastData"
              value={pastData}
              onChange={(e) => setPastData(e.target.value)}
              rows={10}
              className="font-mono mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            <Button onClick={handleGetForecast} isLoading={isForecastLoading} className="mt-4">
              {isForecastLoading ? 'Forecasting...' : 'Generate Forecast'}
            </Button>
          </div>

          <div className="min-h-[300px]">
            {forecastError && <p className="text-red-500">{forecastError}</p>}
            
            {forecast && (
                <div className="animate-fade-in">
                    <h3 className="font-bold text-xl text-gray-700 mb-4">3-Month Forecast</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="Income" fill="#10B981" />
                                <Bar dataKey="Expense" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <h4 className="font-semibold text-green-800">AI Analysis & Tip</h4>
                        <p className="text-green-700 mt-1">{forecast.analysis}</p>
                    </div>
                </div>
            )}
            
            {!isForecastLoading && !forecast && !forecastError && (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Your forecast will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </Card>

      {/* Placeholder for other NairaPro features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
              <h3 className="text-xl font-bold text-gray-700">Invoice Generator</h3>
              <p className="text-gray-500 mt-2">Create and track professional invoices.</p>
              <Button variant="outline" className="mt-4">Create Invoice</Button>
          </Card>
          <Card>
              <h3 className="text-xl font-bold text-gray-700">Legal Templates</h3>
              <p className="text-gray-500 mt-2">Access contracts, NDAs, and more.</p>
               <Button variant="outline" className="mt-4">Browse Templates</Button>
          </Card>
          <Card>
              <h3 className="text-xl font-bold text-gray-700">Funding Opportunities</h3>
              <p className="text-gray-500 mt-2">Find grants and loans for your SME.</p>
               <Button variant="outline" className="mt-4">Explore Funding</Button>
          </Card>
      </div>

    </div>
  );
};

export default NairaPro;
