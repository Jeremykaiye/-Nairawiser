
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { getInvestmentAdvice } from '../services/geminiService';
import type { InvestmentOpportunity, InvestmentAdvice } from '../types';
import { ICONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const opportunities: InvestmentOpportunity[] = [
  { id: '1', name: 'MTN Nigeria', type: 'Stocks', expectedReturn: '15% p.a.', riskLevel: 'Medium' },
  { id: '2', name: 'Lekki Gardens Phase V', type: 'Real Estate', expectedReturn: '25% p.a.', riskLevel: 'Medium' },
  { id: '3', name: 'FGN Savings Bond', type: 'Bonds', expectedReturn: '11% p.a.', riskLevel: 'Low' },
  { id: '4', name: 'ThriveAgric Farm', type: 'AgriTech', expectedReturn: '20% p.a.', riskLevel: 'High' },
];

const RiskProfileSelector: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
    <div className="flex space-x-2">
      {['Low', 'Medium', 'High'].map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-4 py-2 rounded-lg text-sm transition ${value === level ? 'bg-green-600 text-white shadow' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
);

const AllocationChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


const InvestNaira: React.FC = () => {
  const [riskProfile, setRiskProfile] = useState('Medium');
  const [goals, setGoals] = useState('Save for a Masters Degree in 5 years.');
  const [age, setAge] = useState(30);
  const [advice, setAdvice] = useState<InvestmentAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    const result = await getInvestmentAdvice(riskProfile, goals, age);
    if (result) {
      setAdvice(result);
    } else {
      setError('Could not fetch investment advice. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">InvestNaira</h1>
        <p className="text-gray-500 mt-1">Grow your wealth with smart investment choices.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-xl text-gray-700 mb-4">Personalized Investment Roadmap</h3>
            <p className="text-gray-600 mb-4">
              Let our AI, powered by Gemini, create a custom investment plan based on your profile.
            </p>
            <div className="space-y-4">
              <RiskProfileSelector value={riskProfile} onChange={setRiskProfile} />
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Your Age</label>
                <input type="number" id="age" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700">Financial Goals</label>
                <textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="e.g., Buy a car, Start a business..."
                />
              </div>
              <Button onClick={handleGetAdvice} isLoading={isLoading}>
                {isLoading ? 'Generating...' : 'Get AI Advice'}
              </Button>
            </div>
          </Card>

          {error && <p className="text-red-500">{error}</p>}
          
          {advice && (
            <Card className="animate-fade-in-up">
              <h3 className="font-bold text-xl text-gray-700 mb-4">Your AI-Powered Roadmap</h3>
              <div>
                <h4 className="font-semibold text-lg text-green-700">Strategy Summary</h4>
                <p className="text-gray-600 mt-1">{advice.strategySummary}</p>
              </div>
              <div className="mt-6">
                 <h4 className="font-semibold text-lg text-green-700 mb-2">Suggested Asset Allocation</h4>
                 <AllocationChart data={advice.assetAllocation} />
              </div>
              <div className="mt-6">
                 <h4 className="font-semibold text-lg text-green-700">Recommendations</h4>
                 <ul className="mt-2 space-y-4">
                   {advice.recommendations.map((rec, index) => (
                     <li key={index} className="border-l-4 border-green-500 pl-4">
                       <p className="font-semibold text-gray-800">{rec.name}</p>
                       <p className="text-gray-600">{rec.description}</p>
                     </li>
                   ))}
                 </ul>
              </div>
            </Card>
          )}

        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-xl text-gray-700 mb-4">Curated Opportunities</h3>
            <div className="space-y-4">
              {opportunities.map(op => (
                <div key={op.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <p className="font-bold text-gray-800">{op.name}</p>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-500">{op.type}</span>
                    <span className="font-semibold text-green-600">{op.expectedReturn}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Risk</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${op.riskLevel === 'Low' ? 'bg-blue-100 text-blue-800' : op.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{op.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestNaira;
