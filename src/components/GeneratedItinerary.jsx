import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Hotel, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Calendar,
  Coffee,
  Utensils,
  Info,
  Loader2,
  Navigation,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getMapsLoader } from '../utils/mapsLoader';

const formatDate = (dayIndex, tripData) => {
  if (!tripData?.startDate) {
    return `Day ${dayIndex + 1}`;
  }

  const date = new Date(tripData.startDate);
  date.setDate(date.getDate() + dayIndex);

  return `Day ${dayIndex + 1}: ${date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })}`;
};

const getDestinationImage = (location) => {
  const images = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=2000&q=80',
    'amsterdam': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=2000&q=80',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80'
  };

  const cityKey = Object.keys(images).find(
    key => location.toLowerCase().includes(key)
  );

  return images[cityKey] || images.default;
};

const getLocationImage = async (location, type = 'activity') => {
  try {
    const loader = getMapsLoader();
    await loader.load();

    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve) => {
      service.findPlaceFromQuery(
        {
          query: location,
          fields: ['photos']
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]?.photos?.[0]) {
            resolve(results[0].photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }));
          } else {
            // Fallback images
            const fallbacks = {
              activity: [
                'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80'
              ],
              restaurant: [
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80'
              ],
              hotel: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=400&q=80'
              ]
            };
            const images = fallbacks[type] || fallbacks.activity;
            resolve(images[Math.floor(Math.random() * images.length)]);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error getting location image:', error);
    return null;
  }
};

function LocationImage({ name, type, className }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    getLocationImage(name, type).then(url => {
      if (url) setImageUrl(url);
    });
  }, [name, type]);

  return (
    <img
      src={imageUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`}
      alt={name}
      className={className}
    />
  );
}

function GeneratedItinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!location.state?.aiGeneratedPlan) {
      navigate('/plan-trip');
      return;
    }

    setTripPlan(location.state.aiGeneratedPlan);

    const initializeMap = async () => {
      try {
        const loader = getMapsLoader();
        await loader.load();

        const geocoder = new google.maps.Geocoder();
        const destination = location.state.aiGeneratedPlan.tripDetails.location;

        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const center = results[0].geometry.location;
            
            mapInstanceRef.current = new google.maps.Map(mapRef.current, {
              center,
              zoom: 13,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            });

            const bounds = new google.maps.LatLngBounds();
            const plan = location.state.aiGeneratedPlan;

            // Add destination marker
            const destinationMarker = new google.maps.Marker({
              position: center,
              map: mapInstanceRef.current,
              title: destination,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              }
            });
            bounds.extend(destinationMarker.getPosition());
            markersRef.current.push(destinationMarker);

            // Add markers for all locations
            const addMarker = (address, title, type) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const position = results[0].geometry.location;
                  const marker = new google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title,
                    icon: {
                      url: `https://maps.google.com/mapfiles/ms/icons/${type}-dot.png`
                    }
                  });
                  bounds.extend(position);
                  markersRef.current.push(marker);
                  mapInstanceRef.current.fitBounds(bounds);
                }
              });
            };

            // Add hotels
            plan.hotels?.forEach(hotel => {
              addMarker(hotel.address, hotel.name, 'blue');
            });

            // Add activities and restaurants
            plan.dailyItinerary?.forEach(day => {
              day.activities?.forEach(activity => {
                if (activity.location?.name) {
                  addMarker(activity.location.name, activity.name, 'red');
                }
              });

              day.restaurants?.forEach(restaurant => {
                if (restaurant.address) {
                  addMarker(restaurant.address, restaurant.name, 'yellow');
                }
              });
            });
          } else {
            throw new Error(`Geocoding failed: ${status}`);
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No itinerary data available.</p>
          <button 
            onClick={() => navigate('/plan-trip')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create New Trip
          </button>
        </div>
      </div>
    );
  }

  const destination = tripPlan.tripDetails?.location || 'Your Destination';
  const heroImage = getDestinationImage(destination);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Side - Content */}
        <div className="w-1/2 h-full overflow-y-auto">
          {/* Hero Header */}
          <div className="relative h-[300px]">
            <img 
              src={heroImage}
              alt={destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Your {destination} Adventure
                </h1>
                <div className="flex items-center justify-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{tripPlan.tripDetails.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{tripPlan.tripDetails.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-600" />
              Your Daily Itinerary
            </h2>

            {/* Hotels Section */}
            {tripPlan.hotels && tripPlan.hotels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-primary-50 border-b border-primary-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-primary-600" />
                    Recommended Hotels
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {tripPlan.hotels.map((hotel, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <LocationImage
                            name={hotel.name}
                            type="hotel"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center gap-1 text-primary-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{hotel.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{hotel.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{hotel.address}</span>
                            </div>
                            <span className="font-medium text-primary-600">{hotel.pricePerNight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Itinerary */}
            <div className="space-y-4">
              {tripPlan.dailyItinerary?.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)}
                  >
                    <h3 className="font-medium text-gray-900">
                      {formatDate(dayIndex, location.state?.tripData)}
                    </h3>
                    {expandedDay === dayIndex ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedDay === dayIndex && (
                    <div className="p-4 border-t border-gray-100">
                      {/* Activities Section */}
                      {day.activities?.length > 0 && (
                        <div className="mb-6">
                          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                            <Coffee className="w-5 h-5 text-primary-600" />
                            Activities
                          </h4>
                          <div className="space-y-4">
                            {day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex gap-4">
                                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <LocationImage
                                      name={activity.name}
                                      type="activity"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      {activity.duration && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-4 h-4" />
                                          <span>{activity.duration}</span>
                                        </div>
                                      )}
                                      {activity.price && (
                                        <div className="flex items-center gap-1">
                                          <DollarSign className="w-4 h-4" />
                                          <span>{activity.price}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Restaurants Section */}
                      {day.restaurants?.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                            <Utensils className="w-5 h-5 text-primary-600" />
                            Dining
                          </h4>
                          <div className="space-y-4">
                            {day.restaurants.map((restaurant, restIndex) => (
                              <div key={restIndex} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex gap-4">
                                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <LocationImage
                                      name={restaurant.name}
                                      type="restaurant"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900">{restaurant.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine} Cuisine</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{restaurant.address}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span>{restaurant.priceRange}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-1/2 relative">
          <div ref={mapRef} className="absolute inset-0" />
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4">
                <p className="text-red-600 font-medium mb-2">Unable to load map</p>
                <p className="text-gray-600 mb-4">{mapError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneratedItinerary;