import React, { useState } from 'react';
import { ArrowRight, Quote, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quotes = [
  {
    text: "The world is a book, and those who do not travel read only one page.",
    author: "Saint Augustine"
  },
  {
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller"
  },
  {
    text: "Travel far enough, you meet yourself.",
    author: "David Mitchell"
  }
];

export function Hero() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-8 mb-16 cursor-pointer transition-colors"
            onClick={nextQuote}
          >
            <Quote className="w-6 sm:w-8 h-6 sm:h-8 text-white mb-4 mx-auto" />
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 italic">
              "{quotes[currentQuote].text}"
            </p>
            <p className="text-white/80">
              — {quotes[currentQuote].author}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button 
              onClick={() => navigate('/plan-trip')}
              className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg inline-flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              Start Planning Your Trip
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/ai-planner')}
              className="w-full sm:w-auto bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg inline-flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
            >
              Plan With AI
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}