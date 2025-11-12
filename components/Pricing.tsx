
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';

const CheckmarkIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const Pricing: React.FC = () => {
    const plans = [
        {
            name: 'NairaBasic',
            price: 'Free',
            description: 'Essential tools to start your financial journey.',
            features: [
                'Basic financial literacy modules',
                'Essential budgeting & expense tracking',
                'Bill reminders',
                'Basic savings jars',
            ],
            buttonText: 'Current Plan',
            buttonVariant: 'secondary' as const,
        },
        {
            name: 'NairaPlus',
            price: '₦3,500',
            pricePeriod: '/ month',
            description: 'For students and professionals ready to grow their wealth.',
            features: [
                'All Basic features',
                'Advanced financial literacy modules',
                'Personalized investment roadmaps',
                'Robo-advisor access',
                'Financial Health Score',
                'Priority customer support',
            ],
            buttonText: 'Upgrade to Plus',
            buttonVariant: 'primary' as const,
        },
        {
            name: 'NairaPro',
            price: '₦8,000',
            pricePeriod: '/ month',
            description: 'For business owners and freelancers managing it all.',
            features: [
                'All Plus features',
                'BizLedger (invoicing, expense management)',
                'AI-powered Cashflow Predictor',
                'Funding opportunities list',
                'Contract & legal templates',
                'Dedicated business advisor chat',
            ],
            buttonText: 'Upgrade to Pro',
            buttonVariant: 'outline' as const,
        },
    ];

    return (
        <div className="p-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800">Choose Your Plan</h1>
                <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                    Whether you're just starting out or running a business, NairaWise has a plan that fits your financial goals.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => (
                    <Card key={index} className={`flex flex-col ${plan.name === 'NairaPlus' ? 'border-2 border-green-500 shadow-2xl transform scale-105' : ''}`}>
                        {plan.name === 'NairaPlus' && (
                           <div className="bg-green-500 text-white text-xs font-bold text-center py-1 rounded-t-lg -mx-6 -mt-6 mb-6">MOST POPULAR</div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                        <p className="text-gray-500 mt-2">{plan.description}</p>
                        
                        <div className="my-6">
                            <span className="text-4xl font-extrabold">{plan.price}</span>
                            {plan.pricePeriod && <span className="text-gray-500">{plan.pricePeriod}</span>}
                        </div>

                        <ul className="space-y-3 text-gray-600 flex-grow">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start">
                                    <CheckmarkIcon />
                                    <span className="ml-3">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button variant={plan.buttonVariant} className="mt-8 w-full">
                            {plan.buttonText}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
