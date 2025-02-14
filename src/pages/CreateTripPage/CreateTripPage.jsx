import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MapPin, Calendar, ArrowRight, Sparkles, Globe, 
  Map, Hotel as HotelIcon, Camera, Plane, Users, Utensils, DollarSign, Loader2 
} from 'lucide-react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast, Toaster } from 'sonner';
import { generateTripPlan } from '../../services/aiService';
import { enrichItineraryWithPhotos } from '../../services/placesService';
import { useTripStore } from '../../store/tripStore';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white z-50">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100/50" />
    <div className="relative h-full flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Plane className="w-10 h-10 text-primary-600" />
        </div>
      </div>

      <div className="text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Creating Your Dream Itinerary
        </h2>
        <p className="text-gray-600 mb-8">
          Our AI is crafting the perfect travel plan just for you...
        </p>

        <div className="space-y-6">
          <div className="relative">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-5 h-5 relative">
                <Map className="w-5 h-5 absolute text-primary-600" />
                <Map className="w-5 h-5 absolute text-primary-400 animate-[ping_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              </div>
              <span>Finding the best locations...</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-5 h-5 relative">
                <HotelIcon className="w-5 h-5 absolute text-primary-600" />
                <HotelIcon className="w-5 h-5 absolute text-primary-400 animate-[ping_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
              </div>
              <span>Selecting perfect accommodations...</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-5 h-5 relative">
                <Camera className="w-5 h-5 absolute text-primary-600" />
                <Camera className="w-5 h-5 absolute text-primary-400 animate-[ping_1.5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
              </div>
              <span>Gathering destination photos...</span>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-xs mx-auto">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full w-0 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const budgetOptions = [
  {
    icon: '💰',
    title: 'Budget',
    desc: 'Under $100/day',
    value: 'budget'
  },
  {
    icon: '💵',
    title: 'Moderate',
    desc: '$100-300/day',
    value: 'moderate'
  },
  {
    icon: '💎',
    title: 'Luxury',
    desc: 'Over $300/day',
    value: 'luxury'
  }
];

const travelerOptions = [
  {
    icon: '👤',
    title: 'Solo',
    desc: 'Traveling alone',
    people: 1
  },
  {
    icon: '👥',
    title: 'Couple',
    desc: 'Traveling with partner',
    people: 2
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family/Group',
    desc: '3+ travelers',
    people: 4
  }
];

const cuisineOptions = [
  {
    icon: '🍝',
    title: 'Italian',
    desc: 'Pasta, pizza, and more'
  },
  {
    icon: '🍣',
    title: 'Japanese',
    desc: 'Sushi, ramen, and more'
  },
  {
    icon: '🌮',
    title: 'Mexican',
    desc: 'Tacos, burritos, and more'
  },
  {
    icon: '🍜',
    title: 'Asian',
    desc: 'Various Asian cuisines'
  },
  {
    icon: '🥘',
    title: 'Local',
    desc: 'Traditional local food'
  },
  {
    icon: '🥗',
    title: 'Healthy',
    desc: 'Health-conscious options'
  }
];

const popularDestinations = [
  {
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: '🗽',
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
  }
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAIMode = searchParams.get('mode') === 'ai';
  const setTrip = useTripStore(state => state.setTrip);
  
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    travelers: '',
    budget: '',
    cuisines: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlDestination = searchParams.get('destination');
    if (urlDestination) {
      const decodedDestination = decodeURIComponent(urlDestination);
      setPlace({ label: decodedDestination });
      setFormData(prev => ({ ...prev, location: decodedDestination }));
    }
  }, [searchParams]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return "Start date cannot be in the past";
    }
    if (endDate < startDate) {
      return "End date must be after start date";
    }
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days > 14) {
      return "Trip duration cannot exceed 14 days";
    }
    if (days < 1) {
      return "Trip must be at least 1 day";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location && !place?.label) {
      setError("Please select a destination");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (!formData.travelers) {
      setError("Please select number of travelers");
      return;
    }
    if (!formData.budget) {
      setError("Please select a budget range");
      return;
    }

    const dateError = validateDates(formData.startDate, formData.endDate);
    if (dateError) {
      setError(dateError);
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (isAIMode) {
      setIsGenerating(true);
      try {
        toast.loading("Generating your personalized trip plan...");
        
        const tripData = {
          ...formData,
          location: formData.location || place.label,
          isAIGenerated: true
        };

        const tripPlan = await generateTripPlan(tripData);
        
        toast.loading("Finding photos for your destinations...");
        console.log('Before photo enrichment:', tripPlan);
        
        const enrichedPlan = await enrichItineraryWithPhotos(tripPlan);
        console.log('After photo enrichment:', enrichedPlan);
        
        setTrip(tripData);

        toast.dismiss();
        toast.success("Trip plan generated successfully!");
        
        navigate('/GeneratedItinerary', { 
          state: { 
            tripData: formData,
            aiGeneratedPlan: enrichedPlan
          },
          replace: true
        });
      } catch (error) {
        console.error('Generation Error:', error);
        toast.dismiss();
        toast.error(error.message || "Failed to generate trip plan. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    } else {
      setTrip({
        ...formData,
        location: formData.location || place.label,
        isAIGenerated: false
      });
      navigate('/itinerary');
    }
  };

  const selectDestination = (dest) => {
    setPlace({ label: `${dest.name}, ${dest.country}` });
    handleInputChange('location', `${dest.name}, ${dest.country}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {isGenerating && <LoadingScreen />}
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent mb-4">
            Plan Your Perfect Trip ✈️
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Tell us your preferences and let our AI create your dream itinerary
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Where would you like to go?</h2>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  selectProps={{
                    value: place,
                    onChange: (v) => {
                      setPlace(v);
                      handleInputChange('location', v);
                    },
                    placeholder: "Search for a destination...",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.75rem',
                        border: '2px solid #e2e8f0',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#cbd5e1'
                        }
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? '#f1f5f9' : 'white',
                        color: '#1e293b',
                        cursor: 'pointer'
                      })
                    }
                  }}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">When are you planning to travel?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Who's traveling?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {travelerOptions.map((option) => (
                    <div
                      key={option.title}
                      onClick={() => handleInputChange('travelers', option.people)}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300
                        ${formData.travelers === option.people 
                          ? 'bg-primary-50 border-primary-500 shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                        } border-2`}
                    >
                      <div className="text-4xl mb-3">{option.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What's your budget range?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {budgetOptions.map((option) => (
                    <div
                      key={option.title}
                      onClick={() => handleInputChange('budget', option.value)}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300
                        ${formData.budget === option.value 
                          ? 'bg-primary-50 border-primary-500 shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                        } border-2`}
                    >
                      <div className="text-4xl mb-3">{option.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Select Your Preferred Cuisines</h2>
                  <span className="text-sm text-gray-500">Optional • Choose up to 3</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cuisineOptions.map((cuisine) => (
                    <div
                      key={cuisine.title}
                      onClick={() => {
                        const currentCuisines = formData.cuisines || [];
                        if (currentCuisines.includes(cuisine.title)) {
                          handleInputChange('cuisines', currentCuisines.filter(c => c !== cuisine.title));
                        } else if (currentCuisines.length < 3) {
                          handleInputChange('cuisines', [...currentCuisines, cuisine.title]);
                        }
                      }}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300
                        ${formData.cuisines?.includes(cuisine.title)
                          ? 'bg-primary-50 border-primary-500 shadow-lg'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                        } border-2`}
                    >
                      <div className="text-4xl mb-3">{cuisine.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900">{cuisine.title}</h3>
                      <p className="text-sm text-gray-600">{cuisine.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Popular Destinations</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => selectDestination(dest)}
                      className="group relative h-32 sm:h-40 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full relative py-3 rounded-lg text-white font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                style={{
                  background: 'linear-gradient(-45deg, #FF0000, #FF8C00, #FFD700, #00FF00, #00FFFF, #0000FF, #FF00FF)',
                  backgroundSize: '400% 400%',
                  animation: 'gradient 15s ease infinite',
                }}
              >
                <style>
                  {`
                    @keyframes gradient {
                      0% {
                        background-position: 0% 50%;
                      }
                      50% {
                        background-position: 100% 50%;
                      }
                      100% {
                        background-position: 0% 50%;
                      }
                    }
                    
                    .group:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                      transition: all 0.3s ease;
                    }
                  `}
                </style>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Trip Plan...
                  </>
                ) : (
                  <>
                    Generate My Trip
                    <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}