import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const { setTrip } = useTripStore();
  
  const [destination, setDestination] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState({});
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
    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = end.toISOString().split('T')[0];
    setTrip({
      // destination: {...destination, name: destination.label, coordinates: [destination?.value?.geometry?.location?.lat, destination?.value?.geometry?.location?.lng]},
      destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      interests,
      budget: {
        total: 0,
        currency: 'USD',
        breakdown: {
          activities: 0,
          accommodation: 0,
          dining: 0,
          transport: 0,
        }
      },
      isAIGenerated: isAIMode
    });

    navigate('/itinerary', { 
      state: { 
        navigatedFrom: 'manual'
      }, 
    });
  };

  const handlePlaceSelect = (selected) => {
    // setDestination(selected); // Store selected place

    if (!selected?.value?.place_id) return;

    // Fetch place details (including coordinates) using Places API
    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.getDetails(
      {
        placeId: selected.value.place_id,
        fields: ["geometry"], // Request only geometry (lat, lng)
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setDestination({...selected, name: selected.label, coordinates: [place.geometry.location.lat(), place.geometry.location.lng()]})
        }
      }
    );
  };

  const selectDestination = (dest) => {
    setDestination(`${dest.name}, ${dest.country}`);
  };

  const DateInput = ({ label, selectedDate, setSelectedDate, minDate }) => {
    return (
      <div className="w-full">
        <label className="block text-sm text-gray-700 font-medium mb-1">{label}</label>
        <div className="relative w-full">
          {/* Calendar Icon */}
          {/* <div className='absolute z-10'>
          <Calendar className="  left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          </div> */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <Calendar className="text-gray-500 w-5 h-5" />
        </div>
          {/* Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={minDate}
            dateFormat="MM/dd/yyyy" // Changed to MM/DD/YYYY format
            placeholderText="MM/DD/YYYY"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white outline-none text-gray-900"
            wrapperClassName="w-full relative"
            popperClassName="z-50"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isAIMode ? "AI-Powered Trip Planning" : "Plan Your Next Adventure"}
          </h1>
          <p className="text-lg text-gray-600">
            {isAIMode
              ? "Let our AI create a personalized itinerary based on your preferences"
              : "Choose your destination and dates to start planning your perfect trip"}
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

              <div className="w-full max-w-2xl">
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination
                </label>
                <div className="relative">
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    selectProps={{
                      value: destination,
                      onChange: handlePlaceSelect,
                      placeholder: "Search for a destination...",
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem",
                          border: "1.5px solid #e2e8f0",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#cbd5e1",
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#f1f5f9"
                            : "white",
                          color: "#1e293b",
                          cursor: "pointer",
                          zIndex: "40"
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: "40", // Ensures Google Places dropdown is below the DatePicker
                        }),
                      },
                    }}
                  />
                </div>
              </div>
              {/* <div className="flex">
                <DateInput
                  label="Start Date"
                  selectedDate={startDate}
                  setSelectedDate={setStartDate}
                  minDate={new Date()}
                />

                <DateInput
                  label="End Date"
                  selectedDate={endDate}
                  setSelectedDate={setEndDate}
                  minDate={startDate || new Date()}
                />
              </div> */}
              <div className="w-full max-w-2xl">
                {/* Responsive Flexbox: Two columns on large screens, one column on small screens */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Start Date Picker - Takes 50% Width on Large Screens */}
                  <div className="w-full md:w-1/2">
                    <DateInput
                      label="Start Date"
                      selectedDate={startDate}
                      setSelectedDate={setStartDate}
                      minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </div>

                  {/* End Date Picker - Takes 50% Width on Large Screens */}
                  <div className="w-full md:w-1/2">
                    <DateInput
                      label="End Date"
                      selectedDate={endDate}
                      setSelectedDate={setEndDate}
                      minDate={startDate || new Date().toISOString().split('T')[0]}
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
                      {[
                        "Culture",
                        "Nature",
                        "Food",
                        "Adventure",
                        "History",
                        "Shopping",
                        "Relaxation",
                      ].map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            setInterests((prev) =>
                              prev.includes(interest)
                                ? prev.filter((i) => i !== interest)
                                : [...prev, interest]
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            interests.includes(interest)
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                      {["budget", "medium", "luxury"].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget({})}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            budget === b
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            <h2 className="text-xl font-semibold text-gray-900">
              Popular Destinations
            </h2>
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