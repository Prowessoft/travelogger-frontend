import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';

const popularDestinations = [
  {
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tokyo",
    country: "Japan", 
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
  }
];

export default function PlanTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAIMode = searchParams.get('mode') === 'ai';
  const setTrip = useTripStore((state) => state.setTrip);
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState('medium');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!destination || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setError('End date cannot be before start date');
      return;
    }

    if (isAIMode) {
      setIsGenerating(true);
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGenerating(false);
    }

    setTrip({
      destination,
      startDate,
      endDate,
      interests,
      budget,
      isAIGenerated: isAIMode
    });

    navigate('/itinerary');
  };

  const selectDestination = (dest) => {
    setDestination(`${dest.name}, ${dest.country}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isAIMode ? 'AI-Powered Trip Planning' : 'Plan Your Next Adventure'}
          </h1>
          <p className="text-lg text-gray-600">
            {isAIMode 
              ? 'Let our AI create a personalized itinerary based on your preferences'
              : 'Choose your destination and dates to start planning your perfect trip'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {isAIMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Culture', 'Nature', 'Food', 'Adventure', 'History', 'Shopping', 'Relaxation'].map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            setInterests(prev => 
                              prev.includes(interest)
                                ? prev.filter(i => i !== interest)
                                : [...prev, interest]
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            interests.includes(interest)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-4">
                      {['budget', 'medium', 'luxury'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            budget === b
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Generating Itinerary...
                  </>
                ) : (
                  <>
                    {isAIMode ? (
                      <>
                        Generate AI Itinerary
                        <Sparkles className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Continue Planning
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Popular Destinations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => selectDestination(dest)}
                className="group relative h-40 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium text-sm">{dest.name}</p>
                  <p className="text-white/80 text-xs">{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}