
import React, { useState } from 'react';
import { AppView } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import NairaLearn from './components/NairaLearn';
import InvestNaira from './components/InvestNaira';
import NairaTrack from './components/NairaTrack';
import NairaPro from './components/NairaPro';
import Pricing from './components/Pricing';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-green-600 text-white shadow-lg'
          : 'text-gray-500 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold">{label}</span>
    </button>
  );
};


export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);

  const renderView = () => {
    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard />;
      case AppView.Learn:
        return <NairaLearn />;
      case AppView.Invest:
        return <InvestNaira />;
      case AppView.Track:
        return <NairaTrack />;
      case AppView.Pro:
        return <NairaPro />;
      case AppView.Pricing:
        return <Pricing />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { view: AppView.Dashboard, icon: ICONS.dashboard, label: 'Dashboard' },
    { view: AppView.Learn, icon: ICONS.learn, label: 'NairaLearn' },
    { view: AppView.Invest, icon: ICONS.invest, label: 'InvestNaira' },
    { view: AppView.Track, icon: ICONS.track, label: 'NairaTrack' },
    { view: AppView.Pro, icon: ICONS.pro, label: 'NairaPro' },
    { view: AppView.Pricing, icon: ICONS.pricing, label: 'Pricing' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-4">
        <div className="flex items-center space-x-2 p-4 mb-6">
           <div className="bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center">
            {ICONS.naira}
           </div>
          <h1 className="text-2xl font-bold text-gray-800">NairaWise</h1>
        </div>
        
        <nav className="flex-grow space-y-2">
           {navItems.map(item => (
                <NavItem 
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.view}
                    onClick={() => setCurrentView(item.view)}
                />
            ))}
        </nav>

        <div className="p-4 mt-auto">
            <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="font-bold text-green-800">Upgrade to NairaPro!</p>
                <p className="text-sm text-green-700 mt-1">Unlock powerful business tools and AI forecasting.</p>
                <button 
                  onClick={() => setCurrentView(AppView.Pricing)}
                  className="mt-3 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 hover:text-white transition-colors">
                    View Plans
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
