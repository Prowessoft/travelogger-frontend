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
  MessageSquare
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

function GeneratedItinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    console.log('Location State:', location.state);
    
    if (!location.state?.aiGeneratedPlan) {
      console.log('No trip plan found, redirecting...');
      navigate('/plan-trip');
      return;
    }

    const initializeMap = async () => {
      try {
        console.log('Initializing map...');
        const loader = getMapsLoader();
        await loader.load();

        // Get destination coordinates
        const geocoder = new google.maps.Geocoder();
        const destination = location.state.aiGeneratedPlan.tripDetails.location;
        console.log('Geocoding destination:', destination);

        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const center = results[0].geometry.location;
            console.log('Center coordinates:', center.toString());
            
            // Initialize map
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

            // Add markers for all locations
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

            // Add markers for hotels
            plan.hotels?.forEach(hotel => {
              geocoder.geocode({ address: hotel.address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const position = results[0].geometry.location;
                  const marker = new google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title: hotel.name,
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                  });
                  bounds.extend(position);
                  markersRef.current.push(marker);
                  mapInstanceRef.current.fitBounds(bounds);
                }
              });
            });

            // Add markers for daily activities and restaurants
            plan.dailyItinerary?.forEach(day => {
              day.activities?.forEach(activity => {
                if (activity.location?.name) {
                  geocoder.geocode({ address: activity.location.name }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                      const position = results[0].geometry.location;
                      const marker = new google.maps.Marker({
                        position,
                        map: mapInstanceRef.current,
                        title: activity.name,
                        icon: {
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }
                      });
                      bounds.extend(position);
                      markersRef.current.push(marker);
                      mapInstanceRef.current.fitBounds(bounds);
                    }
                  });
                }
              });

              day.restaurants?.forEach(restaurant => {
                if (restaurant.address) {
                  geocoder.geocode({ address: restaurant.address }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                      const position = results[0].geometry.location;
                      const marker = new google.maps.Marker({
                        position,
                        map: mapInstanceRef.current,
                        title: restaurant.name,
                        icon: {
                          url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        }
                      });
                      bounds.extend(position);
                      markersRef.current.push(marker);
                      mapInstanceRef.current.fitBounds(bounds);
                    }
                  });
                }
              });
            });
          } else {
            throw new Error(`Geocoding failed: ${status}`);
          }
        });

        setTripPlan(location.state.aiGeneratedPlan);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, [location.state, navigate]);

  // ... rest of the component remains the same ...