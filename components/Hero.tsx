
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="text-center space-y-6 max-w-3xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
        Authenticity in the Age of AI
      </h1>
      <p className="text-lg text-slate-400 leading-relaxed">
        AuraVerify is the industry standard for content verification. Our advanced neural networks analyze videos, text, and presentations to detect synthetic origins with up to 99% accuracy. Secure your academic integrity and professional reputation in seconds.
      </p>
    </section>
  );
};

export default Hero;
