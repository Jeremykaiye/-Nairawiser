
import React, { useState } from 'react';
import Card from './common/Card';
import type { LearningModule } from '../types';

const modules: LearningModule[] = [
  { id: '1', title: 'Budgeting on a Student Income', description: 'Learn how to manage your funds effectively while in school.', category: 'Budgeting', content: 'Full content here...' },
  { id: '2', title: 'Understanding Inflation in Nigeria', description: 'How the falling Naira affects your savings and purchasing power.', category: 'Economics', content: 'Full content here...' },
  { id: '3', title: 'Intro to Nigerian Stocks (NGX)', description: 'A beginner\'s guide to investing in the Nigerian stock market.', category: 'Investing', content: 'Full content here...' },
  { id: '4', title: 'Debt Management Strategies', description: 'Avoid predatory lenders and manage your loans wisely.', category: 'Debt', content: 'Full content here...' },
  { id: '5', title: 'Tax for Freelancers & SMEs', description: 'Understand your tax obligations as a small business owner.', category: 'Business', content: 'Full content here...' },
];

const NairaLearn: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  if (selectedModule) {
    return (
      <div className="p-8 animate-fade-in">
        <button onClick={() => setSelectedModule(null)} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
          &larr; Back to all modules
        </button>
        <Card>
          <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{selectedModule.category}</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{selectedModule.title}</h1>
          <p className="text-gray-600 mt-4 leading-relaxed">
            This is where the full content of the learning module would be displayed. For now, this is a placeholder. 
            Interactive elements, quizzes, and videos could be embedded here to enhance the learning experience.
            The module covers: {selectedModule.description}.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">NairaLearn</h1>
        <p className="text-gray-500 mt-1">Your journey to financial freedom starts with knowledge.</p>
      </header>

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Featured Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(module => (
            <Card key={module.id} className="flex flex-col">
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full self-start">{module.category}</span>
              <h3 className="text-xl font-bold text-gray-800 mt-3">{module.title}</h3>
              <p className="text-gray-500 mt-2 flex-grow">{module.description}</p>
              <button 
                onClick={() => setSelectedModule(module)} 
                className="mt-4 text-green-600 hover:text-green-800 font-semibold self-start">
                Read More &rarr;
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NairaLearn;
