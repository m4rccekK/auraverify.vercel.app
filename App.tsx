
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Detector from './components/Detector';
import Footer from './components/Footer';
import Feedback from './components/Feedback';
import LoginModal from './components/LoginModal';
import { PlanType, DetectionResult, User } from './types';

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(PlanType.REGULAR);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Persistence: Check if user was logged in and what plan they had
  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user');
    const savedPlan = localStorage.getItem('aura_plan');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedPlan) {
      setCurrentPlan(savedPlan as PlanType);
    }
  }, []);

  const handlePlanChange = (plan: PlanType) => {
    setCurrentPlan(plan);
    localStorage.setItem('aura_plan', plan);
    setDetectionResult(null);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('aura_user', JSON.stringify(u));
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
    // Reset plan to regular on logout for security demo purposes
    setCurrentPlan(PlanType.REGULAR);
    localStorage.removeItem('aura_plan');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Header 
        currentPlan={currentPlan} 
        onPlanChange={handlePlanChange} 
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-12 space-y-24">
        <Hero />
        
        <Detector 
          isPremium={currentPlan === PlanType.PREMIUM} 
          onResult={setDetectionResult} 
          result={detectionResult}
        />
        
        {detectionResult && (
          <div className="max-w-4xl mx-auto">
             <Feedback />
          </div>
        )}
      </main>

      <Footer />

      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;
