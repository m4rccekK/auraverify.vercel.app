
import React, { useState } from 'react';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [improvementText, setImprovementText] = useState('');

  const handleSubmit = () => {
    setSubmitted(true);
    // Logic to send feedback to backend would go here
  };

  if (submitted) {
    return (
      <div className="bg-slate-800/40 p-8 rounded-3xl text-center border border-slate-700 mt-12">
        <h4 className="text-indigo-400 font-bold text-xl mb-2">Thank you!</h4>
        <p className="text-slate-400">Your feedback helps AuraVerify stay ahead of the curve.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 mt-12 max-w-lg mx-auto">
      <h4 className="text-slate-100 font-bold mb-4 text-center">How was your experience?</h4>
      
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 ${
                (hover || rating) >= star ? 'text-yellow-400' : 'text-slate-600'
              } fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>

      {rating > 0 && rating < 3 && (
        <div className="mb-6 space-y-2 animate-in fade-in zoom-in-95">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">How can we improve our web application?</label>
          <textarea
            value={improvementText}
            onChange={(e) => setImprovementText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Tell us what went wrong..."
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-slate-700 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors"
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedback;
