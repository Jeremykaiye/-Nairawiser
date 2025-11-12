
import React from 'react';
import Card from './common/Card';
import type { Transaction, SavingsJar } from '../types';
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

const savingsJars: SavingsJar[] = [
    { id: '1', name: 'New Laptop', currentAmount: 250000, goalAmount: 600000, emoji: '💻' },
    { id: '2', name: 'Vacation to Ghana', currentAmount: 75000, goalAmount: 200000, emoji: '✈️' },
    { id: '3', name: 'Emergency Fund', currentAmount: 450000, goalAmount: 1000000, emoji: '🛡️' },
];

const NairaTrack: React.FC = () => {
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

        <Card>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Savings Jars</h2>
          <div className="space-y-5">
            {savingsJars.map(jar => (
                <div key={jar.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg">{jar.emoji} {jar.name}</span>
                    <span className="text-sm font-medium text-green-600">{Math.round((jar.currentAmount / jar.goalAmount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{ width: `${(jar.currentAmount / jar.goalAmount) * 100}%` }}></div>
                  </div>
                  <p className="text-sm text-right mt-1 text-gray-600">₦{jar.currentAmount.toLocaleString()} / ₦{jar.goalAmount.toLocaleString()}</p>
                </div>
              ))}
          </div>
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
