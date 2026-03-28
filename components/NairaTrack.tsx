
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { getSavingsSuggestions } from '../services/geminiService';
import type { Transaction, SavingsJar, SavingsGoalSuggestion } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const spendingData = [
  { name: 'Food & Groceries', value: 45000 },
  { name: 'Transport', value: 25000 },
  { name: 'Airtime & Data', value: 15000 },
  { name: 'Utilities & Bills', value: 30000 },
  { name: 'Entertainment', value: 22000 },
  { name: 'Health', value: 8000 },
];
const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

const transactions: Transaction[] = [
    { id: '1', name: 'DSTV Subscription', category: 'Utilities & Bills', amount: 12500, date: '2024-07-28', type: 'expense' },
    { id: '2', name: 'Client Payment', category: 'Income', amount: 150000, date: '2024-07-27', type: 'income' },
    { id: '3', name: 'The Place Restaurant', category: 'Food & Groceries', amount: 4500, date: '2024-07-26', type: 'expense' },
    { id: '4', name: 'Uber Trip', category: 'Transport', amount: 2300, date: '2024-07-25', type: 'expense' },
    { id: '5', name: 'MTN Airtime', category: 'Airtime & Data', amount: 5000, date: '2024-07-25', type: 'expense' },
];

const initialSavingsJars: SavingsJar[] = [
    { id: '1', name: 'New Laptop', currentAmount: 250000, goalAmount: 600000, emoji: '💻' },
    { id: '2', name: 'Vacation to Ghana', currentAmount: 75000, goalAmount: 200000, emoji: '✈️' },
    { id: '3', name: 'Emergency Fund', currentAmount: 450000, goalAmount: 1000000, emoji: '🛡️' },
];

const NairaTrack: React.FC = () => {
  const [jars, setJars] = useState<SavingsJar[]>(initialSavingsJars);
  const [suggestions, setSuggestions] = useState<SavingsGoalSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    // Simulate context: Assuming monthly income around 350k based on data
    const income = 350000;
    const result = await getSavingsSuggestions(income, spendingData);
    if (result) {
      setSuggestions(result);
    }
    setIsLoadingSuggestions(false);
  };

  const addSuggestionToJars = (suggestion: SavingsGoalSuggestion) => {
    const newJar: SavingsJar = {
      id: Date.now().toString(),
      name: suggestion.name,
      currentAmount: 0,
      goalAmount: suggestion.targetAmount,
      emoji: suggestion.emoji
    };
    setJars([...jars, newJar]);
    // Remove the added suggestion from the list
    setSuggestions(suggestions.filter(s => s.name !== suggestion.name));
  };

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">NairaTrack</h1>
        <p className="text-gray-500 mt-1">Keep tabs on your spending and stay on budget.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Spending Breakdown</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Savings Jars</h2>
            <Button 
              variant="outline" 
              onClick={handleGetSuggestions} 
              isLoading={isLoadingSuggestions}
              className="text-sm py-1 px-3"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              AI Suggestions
            </Button>
          </div>
          
          <div className="space-y-5 mb-6">
            {jars.map(jar => (
                <div key={jar.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg">{jar.emoji} {jar.name}</span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((jar.currentAmount / jar.goalAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{ width: `${(jar.currentAmount / jar.goalAmount) * 100}%` }}></div>
                  </div>
                  <p className="text-sm text-right mt-1 text-gray-600">₦{jar.currentAmount.toLocaleString()} / ₦{jar.goalAmount.toLocaleString()}</p>
                </div>
              ))}
          </div>

          {/* AI Suggestions Section */}
          {suggestions.length > 0 && (
            <div className="mt-auto pt-6 border-t border-gray-100 animate-fade-in-up">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">✨ Suggested for you</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{suggestion.emoji} {suggestion.name}</p>
                      <p className="text-xs text-gray-600 mt-1 max-w-[250px]">{suggestion.reasoning}</p>
                      <p className="text-xs font-semibold text-green-700 mt-1">Target: ₦{suggestion.targetAmount.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => addSuggestionToJars(suggestion)}
                      className="bg-white text-green-600 hover:bg-green-600 hover:text-white border border-green-200 rounded-full p-2 transition-colors"
                      title="Add to my jars"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">{tx.name}</p>
                <p className="text-sm text-gray-500">{tx.category} &bull; {tx.date}</p>
              </div>
              <p className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NairaTrack;