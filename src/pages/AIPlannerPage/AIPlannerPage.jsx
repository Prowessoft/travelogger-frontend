import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Lightbulb, Zap } from 'lucide-react';

export default function AIPlannerPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/create-trip?mode=ai');
  };

  const destinations = [
    {
      name: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    },
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80",
    },
    {
      name: "New York City, USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80",
    },
    {
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div 
        className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-32"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Hero Content */}
        <div className="relative flex-1 flex items-center justify-center px-4 mt-12">
          <div className="text-center max-w-4xl mx-auto">
            <style>
              {`
                @keyframes gradientText {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                
                .magical-text {
                  background: linear-gradient(
                    300deg,
                    #ff6b6b,
                    #4ecdc4,
                    #45b7d1,
                    #96c93d,
                    #ff6b6b
                  );
                  background-size: 300% 300%;
                  animation: gradientText 10s ease infinite;
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                }

                .magical-button {
                  background: linear-gradient(
                    300deg,
                    #ff6b6b,
                    #4ecdc4,
                    #45b7d1,
                    #96c93d,
                    #ff6b6b
                  );
                  background-size: 300% 300%;
                  animation: gradientText 10s ease infinite;
                  transition: all 0.3s ease;
                }

                .magical-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
              `}
            </style>
            <h1 className="text-5xl md:text-6xl font-bold magical-text mb-6">
              Discover Your Next Adventure
              <br />
              with AI-Powered Travel Planning
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let our advanced AI create personalized travel itineraries tailored to your interests, 
              preferences, and travel style. Experience smarter travel planning.
            </p>
            <button
              onClick={handleGetStarted}
              className="magical-button inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-medium text-lg group"
            >
              Get Started with AI
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative mt-12 bg-gradient-to-t from-black/80 to-transparent py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Personalized Planning</h3>
                <p className="text-white/80">
                  AI-powered recommendations based on your preferences and travel style.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Suggestions</h3>
                <p className="text-white/80">
                  Discover hidden gems and local favorites at your destination.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Itineraries</h3>
                <p className="text-white/80">
                  Generate complete travel plans in seconds, not hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className="relative py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Popular Destinations for AI Planning
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {destinations.map((destination) => (
                <div 
                  key={destination.name}
                  className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => navigate(`/create-trip?mode=ai&destination=${encodeURIComponent(destination.name)}`)}
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <button className="mt-2 inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      Plan with AI
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}