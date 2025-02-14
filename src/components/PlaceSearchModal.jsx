import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Star, Plus, Search, Loader2, Clock, Navigation, DollarSign } from 'lucide-react';
import { getMapsLoader } from '../utils/mapsLoader';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export function PlaceSearchModal({ isOpen, onClose, onPlaceSelect, mapCenter }) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [error, setError] = useState('');
  const searchService = useRef(null);
  const mapDiv = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen || mapsLoaded || !mapDiv.current) return;

    const loader = getMapsLoader();
    
    loader.load().then(() => {
      const map = new google.maps.Map(mapDiv.current, {
        center: mapCenter,
        zoom: 15
      });
      searchService.current = new google.maps.places.PlacesService(map);
      setMapsLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Maps:', err);
      setError('Failed to load Google Maps. Please try again later.');
    });
  }, [isOpen, mapsLoaded, mapCenter]);

  const handlePlaceSelect = (selectedPlace) => {
    if (!selectedPlace?.value?.place_id) return;

    setLoading(true);
    searchService.current.getDetails(
      {
        placeId: selectedPlace.value.place_id,
        fields: [
          'name',
          'geometry',
          'formatted_address',
          'photos',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'price_level',
          'website',
          'formatted_phone_number',
          'types',
          'url'
        ]
      },
      (place, status) => {
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const enhancedPlace = {
            id: Math.random().toString(36).substr(2, 9),
            title: place.name,
            description: place.formatted_address,
            location: {
              name: place.formatted_address,
              coordinates: [
                place.geometry.location.lat(),
                place.geometry.location.lng()
              ]
            },
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            // priceLevel: place.price_level ? '$'.repeat(place.price_level) : null,
            priceLevel: place.price_level ? '' : null,
            website: place.website,
            formatted_phone_number: place.formatted_phone_number,
            url: place.url, // Google Maps URL
            formattedHours: place.opening_hours?.weekday_text?.map(day => ({
              day: day.split(': ')[0],
              hours: day.split(': ')[1]
            })) || [],
            isOpen: place.opening_hours?.isOpen?.() || false,
            photos: place.photos?.map(photo => ({
              url: photo.getUrl({ maxWidth: 400, maxHeight: 300 })
            })) || []
          };

          onPlaceSelect(enhancedPlace);
          onClose();
        } else {
          setError('Failed to get place details. Please try again.');
        }
      }
    );
  };

  // Handle click outside to close
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-[10vh]"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl"
        style={{ minHeight: '300px' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Place to Itinerary
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              selectProps={{
                value: place,
                onChange: handlePlaceSelect,
                placeholder: "Search for a place...",
                isLoading: loading,
                loadingMessage: () => "Searching...",
                noOptionsMessage: () => "No places found",
                isClearable: true,
                className: "place-select",
                classNamePrefix: "place-select",
                styles: {
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  }),
                  control: (provided) => ({
                    ...provided,
                    minHeight: '44px',
                    borderRadius: '0.5rem',
                    borderColor: '#E5E7EB',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#D1D5DB'
                    }
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: '#111827',
                    fontSize: '1rem',
                    padding: '8px'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    fontSize: '1rem',
                    padding: '12px 16px',
                    backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                    color: '#111827',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: '#E5E7EB'
                    }
                  }),
                  menu: (provided) => ({
                    ...provided,
                    marginTop: '4px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 2,
                    position: 'absolute',
                    width: '100%',
                    backgroundColor: 'white'
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '400px',
                    padding: 0
                  })
                }
              }}
            />
          </div>
        </div>

        {/* Hidden map div for Places Service */}
        <div ref={mapDiv} style={{ display: 'none' }} />
      </div>
    </div>
  );
}