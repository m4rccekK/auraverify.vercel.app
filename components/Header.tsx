
import React, { useState } from 'react';
import { PlanType, User } from '../types';

interface HeaderProps {
  currentPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPlan, onPlanChange, user, onLoginClick, onLogoutClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-100">AuraVerify</span>
        </div>

        {/* Right Section: Plans & Auth */}
        <div className="flex items-center gap-6">
          {/* Plans Section */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="bg-slate-800 p-1 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => onPlanChange(PlanType.REGULAR)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentPlan === PlanType.REGULAR 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => onPlanChange(PlanType.PREMIUM)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentPlan === PlanType.PREMIUM 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-indigo-400'
                }`}
              >
                Premium
              </button>
            </div>
            <p className="text-[10px] mt-1 text-slate-500 font-medium">
              {currentPlan === PlanType.PREMIUM ? "€1.99/mo Plan Active" : "Currently on Free Plan"}
            </p>
          </div>

          {/* Auth Section */}
          <div className="relative">
            {user ? (
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full border-2 border-slate-700 overflow-hidden hover:border-indigo-500 transition-all flex items-center justify-center bg-slate-800"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-400 font-bold">{user.name.charAt(0)}</span>
                )}
              </button>
            ) : (
              <button 
                onClick={onLoginClick}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                title="Login / Register"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-slate-700 mb-2">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">Settings</button>
                <button 
                  onClick={() => {
                    onLogoutClick();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
