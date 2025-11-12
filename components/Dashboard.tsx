
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { ICONS } from '../constants';
import type { Transaction, SavingsJar } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const portfolioData = [
  { name: 'Jan', value: 500000 },
  { name: 'Feb', value: 520000 },
  { name: 'Mar', value: 510000 },
  { name: 'Apr', value: 550000 },
  { name: 'May', value: 580000 },
  { name: 'Jun', value: 620000 },
];

const spendingData = [
  { name: 'Food', value: 45000 },
  { name: 'Transport', value: 25000 },
  { name: 'Airtime', value: 10000 },
  { name: 'Utilities', value: 30000 },
  { name: 'Entertainment', value: 20000 },
];

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

const recentTransactions: Transaction[] = [
  { id: '1', name: 'DSTV Subscription', category: 'Utilities', amount: 12500, date: '2024-07-28', type: 'expense' },
  { id: '2', name: 'Freelance Payment', category: 'Income', amount: 150000, date: '2024-07-27', type: 'income' },
  { id: '3', name: 'Chicken Republic', category: 'Food', amount: 4500, date: '2024-07-26', type: 'expense' },
];

const savingsJars: SavingsJar[] = [
  { id: '1', name: 'New Laptop', currentAmount: 250000, goalAmount: 600000, emoji: '💻' },
  { id: '2', name: 'December Detty', currentAmount: 75000, goalAmount: 200000, emoji: '🎉' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Tunde!</h1>
        <p className="text-gray-500 mt-1">Here's your financial snapshot for today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-green-600 text-white">
          <h2 className="font-semibold text-lg opacity-80">Total Balance</h2>
          <p className="text-4xl font-bold mt-2 flex items-center">
            {ICONS.naira} 1,250,345.50
          </p>
          <p className="mt-2 opacity-70">+5.2% from last month</p>
        </Card>
        <Card className="md:col-span-1">
          <h2 className="font-semibold text-lg text-gray-600">Monthly Spending</h2>
          <p className="text-4xl font-bold text-red-500 mt-2 flex items-center">
            {ICONS.naira} 89,500.00
          </p>
        </Card>
        <Card className="md:col-span-1">
          <h2 className="font-semibold text-lg text-gray-600">Monthly Income</h2>
          <p className="text-4xl font-bold text-green-500 mt-2 flex items-center">
            {ICONS.naira} 350,000.00
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-xl text-gray-700 mb-4">Portfolio Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-xl text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Add Expense</Button>
            <Button variant="outline" className="w-full">Add Income</Button>
            <Button variant="secondary" className="w-full">Find an Investment</Button>
            <Button variant="secondary" className="w-full">Pay a Bill</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
            <h3 className="font-bold text-xl text-gray-700 mb-4">Recent Transactions</h3>
            <div className="space-y-4">
                {recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{tx.name}</p>
                            <p className="text-sm text-gray-500">{tx.category} - {tx.date}</p>
                        </div>
                        <p className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'income' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
        <Card className="lg:col-span-2">
            <h3 className="font-bold text-xl text-gray-700 mb-4">Savings Jars</h3>
            <div className="space-y-4">
              {savingsJars.map(jar => (
                <div key={jar.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{jar.emoji} {jar.name}</span>
                    <span className="text-sm text-gray-500">{Math.round((jar.currentAmount / jar.goalAmount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(jar.currentAmount / jar.goalAmount) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500">₦{jar.currentAmount.toLocaleString()} / ₦{jar.goalAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
