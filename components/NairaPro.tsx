
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { getCashflowForecast } from '../services/geminiService';
import type { CashflowForecast } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NairaPro: React.FC = () => {
  const [pastData, setPastData] = useState(
`[
  {"month": "April", "income": 500000, "expense": 350000},
  {"month": "May", "income": 650000, "expense": 400000},
  {"month": "June", "income": 580000, "expense": 420000}
]`
  );
  const [forecast, setForecast] = useState<CashflowForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetForecast = async () => {
    setIsLoading(true);
    setError(null);
    setForecast(null);
    try {
        // Validate JSON
        JSON.parse(pastData);
    } catch (e) {
        setError("Invalid JSON format in historical data.");
        setIsLoading(false);
        return;
    }

    const result = await getCashflowForecast(pastData);
    if (result) {
      setForecast(result);
    } else {
      setError('Could not generate cashflow forecast. Please try again.');
    }
    setIsLoading(false);
  };
  
  const chartData = forecast?.forecast.map(f => ({
    name: f.month,
    Income: f.predictedIncome,
    Expense: f.predictedExpense,
    Net: f.predictedIncome - f.predictedExpense
  }));


  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">NairaPro</h1>
          <p className="text-gray-500 mt-1">Powerful tools for your business or freelance hustle.</p>
        </div>
        <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">PREMIUM</span>
      </header>

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
            <Button onClick={handleGetForecast} isLoading={isLoading} className="mt-4">
              {isLoading ? 'Forecasting...' : 'Generate Forecast'}
            </Button>
          </div>

          <div className="min-h-[300px]">
            {error && <p className="text-red-500">{error}</p>}
            
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
            
            {!isLoading && !forecast && !error && (
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
