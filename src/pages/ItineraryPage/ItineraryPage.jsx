import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  Coffee,
  Utensils,
  MapPin,
  Hotel,
  Navigation,
  Save,
  Share2,
  DollarSign,
  Calculator,
} from "lucide-react";
import { useTripStore } from "../../store/tripStore";
import { useItineraryStore } from "../../store/itineraryStore";
import { useAuthStore } from "../../store/authStore";
import itineraryService from "../../services/itineraryService";
import emailService from "../../services/emailService";
import { toast } from "sonner";
import { SortableActivityItem } from "../../components/SortableActivityItem";
import { PlaceSearchModal } from "../../components/PlaceSearchModal";
import { getMapsLoader } from "../../utils/mapsLoader";
import { useLocation } from "react-router-dom";

const getDestinationImage = (des) => {
  const images = {
    paris:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    london:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80",
    "new york":
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80",
    tokyo:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80",
    dubai:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80",
    default:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80",
  };

  const cityKey = Object.keys(images).find((key) =>
    des?.name?.split(",")[0].toLowerCase().includes(key)
  );

  return images[cityKey] || images.default;
};

export default function ItineraryPage() {
  const location = useLocation();
  const { itineraryId } = location.state || {};
  // const { id: itineraryId } = useParams();
  const navigate = useNavigate();
  const { currentTrip: trip, setTrip } = useTripStore();
  const {
    days,
    selectedDay,
    addActivity,
    removeActivity,
    reorderActivities,
    setSelectedDay,
    initializeDays,
    getItinerary,
    setItinerary
  } = useItineraryStore();
  const { user } = useAuthStore();
  const [expandedDay, setExpandedDay] = useState(0);
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [daysData, setDaysData] = useState([]);
  const [currentAddType, setCurrentAddType] = useState("activity");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const navigatedFrom = location.state?.navigatedFrom;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  useEffect(() => {
    // Function to check screen size dynamically
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    // Run check once on mount
    checkScreenSize();


    // Listen for screen resize
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  useEffect(() => {
    return () => {
      if(navigatedFrom !== 'ai') {
        sessionStorage.removeItem("currentTrip"); // Clears only "trip" on route change
        setItinerary({});
        console.log("Trip field cleared on route change");
      }
    };
}, [location]);

  useEffect(() => {
    const itiData = getItinerary();
    const itineraryDataLen = Object.keys(itiData ?? {}).length;
    if (!trip || itineraryId || itineraryDataLen > 0) {
      console.log("inside:::");
      return;
    }

    // Initialize days based on trip dates
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const intialItinerary = {
        id: "",
        userId: user?.id,
        title: trip.destination?.name || trip.destination?.name,
        tripImg: "",
        status: "draft",
        visibility: "private",
        tripDetails: trip,
        days: [],
        sharedWith: [],
        metadata: { tags: null, isTemplate: false, language: "en", version: 1 },
        generatedBy: 'manual'
    };

    const initialDays = Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      return {
        date: date.toISOString().split('T')[0],
        dayNumber: index + 1,
        sections: {
          activities: [],
          restaurants: [],
          hotels: []
        }
      };
    });
    setItinerary({...intialItinerary, days: initialDays})
    initializeDays(initialDays);
    setLoading(false);

  }, [trip, navigate, initializeDays, itineraryId]);



  useEffect(() => {
    const loadSavedItinerary = async () => {
      const itiData = getItinerary();
      const itineraryDataLen = Object.keys(itiData ?? {}).length;
      
      if (!itineraryId && itineraryDataLen === 0) { 
        return;
      }
  
      try {
        setLoading(true);
        let savedItinerary = itiData; // Default to existing data
  
        if (itineraryId && !savedItinerary.id) { 
          // Only fetch if we don't already have it
          savedItinerary = await itineraryService.getItinerary(itineraryId);
          setTrip(savedItinerary.tripDetails);
          setItinerary(savedItinerary); 
        }
  
        initializeDays(savedItinerary.days);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load itinerary:", error);
        toast.error("Failed to load itinerary");
        navigate("/plan-trip");
      }
    };
  
    loadSavedItinerary();
  }, [itineraryId, initializeDays, navigate]);

  useEffect(() => {
    if (!trip || !isLargeScreen) {
      return;
    }
    const setupMap = async () => {
      try {
        if (!trip) { 
          // navigate('/plan-trip');
          return;
        }

        const loader = getMapsLoader();
        
        console.log("Loader initialized, calling load...");
        await loader.load();
        console.log("Maps loaded successfully");

        const geocoder = new google.maps.Geocoder();
        const destination = trip.destination ? trip.destination.label || trip.destination?.name : trip.location;


        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            mapInstanceRef.current = new google.maps.Map(mapRef.current, {
              center: location,
              zoom: 13,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            });

            // Add destination marker
            new google.maps.Marker({
              position: location,
              map: mapInstanceRef.current,
              title: destination,
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              },
            });
            const bounds = new google.maps.LatLngBounds();

            const addMarker = (address, title, type) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const position = results[0].geometry.location;
                  const marker = new google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title,
                    icon: {
                      url: `https://maps.google.com/mapfiles/ms/icons/${type}-dot.png`,
                    },
                  });
                  bounds.extend(position);
                  markersRef.current.push(marker);
                  mapInstanceRef.current.fitBounds(bounds);
                }
              });
            };

            days.forEach((day) => {
              day.sections.hotels?.forEach((hotel) => {
                addMarker(hotel.location.address, hotel.location.name, "blue");
              });
              day.sections.activities?.forEach((activity) => {
                  addMarker(activity.location.address, activity.location.name, "red");
              });
              day.sections.restaurants?.forEach((restaurant) => {
                  addMarker(restaurant.location.address, restaurant.location.name, "yellow");
              });
            });
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Map initialization failed:", error);
        setMapError(error.message);
        setLoading(false);
      }
    };
    setupMap();

    // Cleanup function: Clears markers when component unmounts
    // return () => {
    // markersRef.current.forEach((marker) => marker.setMap(null));
    // markersRef.current = [];
    // };
    
  }, [trip, navigate, isLargeScreen]);

  const handleSearch = () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setSearching(true);
    const service = new google.maps.places.PlacesService(
      mapInstanceRef.current
    );

    service.textSearch(
      {
        query: searchQuery,
        location: mapInstanceRef.current.getCenter(),
        radius: 5000,
      },
      (results, status) => {
        setSearching(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setSearchResults(results);

          // Update map bounds to show all results
          const bounds = new google.maps.LatLngBounds();
          results.forEach((place) => {
            bounds.extend(place.geometry.location);

            // Add marker for each result
            new google.maps.Marker({
              position: place.geometry.location,
              map: mapInstanceRef.current,
              title: place.name,
              animation: google.maps.Animation.DROP,
            });
          });

          mapInstanceRef.current?.fitBounds(bounds);
        } else {
          setSearchResults([]);
        }
      }
    );
  };

  const handlePlaceSelect = (place, type = "activity") => {
    if (!place || !place.location) {
      console.error("Invalid place data:", place);
      return;
    }

    const newItem = {
      // id: Math.random().toString(36).substr(2, 9),
      type: place.type,
      title: place.title,
      description: place.description,
      location: {
        name: place.title,
        address: place.location.name,
        coordinates: place.location.coordinates,
      },
      startTime: null,
      endTime: null,
      duration: null,
      price: null,
      priceLevel: place.priceLevel,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: [ {
        url: place.photos[2].url,
        ccaption: null
      }
      ],
      contact: {
        googleMapsUrl: place.url,
        website: place.website,
        phone: place.formatted_phone_number
      },
      operatingHours: {
        isOpen: place.isOpen,
        periods: []
      },
      bookingInfo: null,
      cuisine: null
    };
    // const updatedItinerary = addActivity(selectedDay, newItem, type);
    const updatedItinerary = addActToItinerary(getItinerary(), selectedDay, newItem, type);
    setItinerary(updatedItinerary)
    initializeDays(updatedItinerary.days);
    setIsPlaceSearchOpen(false);

    // Add marker to the map
    if (mapInstanceRef.current && place.location.coordinates) {
      const [lat, lng] = place.location.coordinates;
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: place.title,
        animation: google.maps.Animation.DROP,
        icon: {
          url:
            type === "hotel"
              ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              : type === "restaurant"
              ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
      });
      markersRef.current.push(marker);
      mapInstanceRef.current.panTo({ lat, lng });
    }
  };

  const addActToItinerary = (itinerary, dayIndex, activity, sectionType) => {
    const budget =  {
      planned: 0,
      actual: 0
    }
      const updatedDays = itinerary.days.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              budget,
              sections: {
                ...day.sections,
                [sectionType]: [...(day.sections[sectionType] || []), activity], // Append activity
              },
            }
          : day
      );

      return {
          ...itinerary,
          days: updatedDays, // Ensure days inside itinerary are updated
      };
    // })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = days[selectedDay].activities.findIndex(
        (activity) => activity.id === active.id
      );
      const newIndex = days[selectedDay].activities.findIndex(
        (activity) => activity.id === over.id
      );
      reorderActivities(selectedDay, oldIndex, newIndex);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) {
        toast.error("Please sign in to save your itinerary");
        return;
      }

      if (!trip) {
        toast.error("No trip data found");
        return;
      }

      toast.loading("Saving your itinerary...");

      // Log the data being sent for debugging
      console.log("Saving itinerary with data:", {
        days,
        trip,
        user,
      });
      // // attach trip image to trip
      getItinerary().tripImg = getDestinationImage(trip.destination.name);
      if (itineraryId) {
        // await itineraryService.updateItinerary(itineraryId, daysData, trip, user);
        // const budget = {planned: 0, actual: 0};
        await itineraryService.updateItinerary(itineraryId, getItinerary());
        // return;
      } else {
        // const updatedItinerary = {...itineraryData, generatedBy: 'ai'}
        await itineraryService.saveItinerary({...getItinerary(), userId:user.id});
        // return;
      }
      toast.dismiss();
      toast.success("Itinerary saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to save itinerary");
    }
  };

  const handleShare = async () => {
    // TODO: Implement share functionality
    console.log("Sharing itinerary...");
    await emailService.sendEmail(days, trip, user);
  };

  const renderSection = (day, dayIndex, type) => {
    const items = day.sections[type];
    const icon =
      type === "hotels" ? (
        <Hotel className="w-5 h-5 text-primary-600" />
      ) : type === "restaurants" ? (
        <Utensils className="w-5 h-5 text-primary-600" />
      ) : (
        <Coffee className="w-5 h-5 text-primary-600" />
      );

    const title =
      type === "hotels"
        ? "Hotels"
        : type === "restaurants"
        ? "Restaurants"
        : "Activities";

    const sectionKey = `${dayIndex}-${type}`;

    return (
      <div key={sectionKey} className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        </div>
        <SortableContext
          items={items.map((item, index) => item.id || index)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item, itemIndex) => (
              <SortableActivityItem
                key={itemIndex}
                activity={item}
                onRemove={() => removeActivity(dayIndex, itemIndex, item.type)}
                number={itemIndex + 1}
                nextActivity={items[itemIndex + 1]}
              />
            ))}
          </div>
        </SortableContext>
        <button
          onClick={() => {
            setCurrentAddType(type);
            setIsPlaceSearchOpen(true);
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg border border-dashed border-gray-300 hover:border-primary-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">
            Add{" "}
            {type === "hotel"
              ? "a hotel"
              : type === "restaurant"
              ? "a restaurant"
              : "an activity"}
          </span>
        </button>
      </div>
    );
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Side - Content */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto">
          {/* Hero Header */}
          <div className="relative h-[300px]">
            <img
              src={getDestinationImage(trip?.destination)}
              alt={trip?.destination || "Destination"}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {trip
                    ? `Plan Your ${
                        trip.destination?.label || trip.location || trip.destination?.name
                      } Trip`
                    : "Plan Your Trip"}
                </h1>
                {trip && (
                  <div className="flex items-center justify-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {/* {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} */}
                        {new Date(trip.startDate).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                    <Calendar className="w-7 h-7 text-primary-600" />
                    Your Daily Itinerary
                  </h2>
                  <p className="text-gray-600">
                    Plan your trip day by day. Add hotels, activities, and
                    restaurants to create your perfect itinerary.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  {/* Budget Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Calculator className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Total Budget
                      </div>
                      <div className="flex font-bold text-primary-600">
                        <DollarSign className="w-4" />

                        {/* ${calculateTotalBudget().toFixed(2)} */}
                        {trip?.budget?.total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-4">
                {days.map((day, index) => (
                  // {daysData.map((day, index) => (
                  <div
                    key={`day-${index}`}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setExpandedDay(expandedDay === index ? -1 : index);
                        setSelectedDay(index);
                      }}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Day {index + 1}:{" "}
                          {new Date(day.date).toLocaleDateString("en-US", {
                            timeZone: 'UTC',
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {day.sections.hotels.length + day.sections.restaurants.length + day.sections.activities.length}{"  "}
                            {day.sections.hotels.length + day.sections.restaurants.length + day.sections.activities.length === 1 ? "item" : "items"}
                          </span>
                          { day.budget?.planned  && <div className="flex items-center gap-1 text-primary-600">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {day.budget?.planned || ''}
                              {/* ${calculateDayBudget(day.activities).toFixed(2)} */}
                            </span>
                          </div> }
                        </div>
                      </div>
                      {expandedDay === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedDay === index && (
                      <div className="p-4 border-t border-gray-100">
                        {/* Daily Budget Summary */}
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                          { day.budget?.planned  && <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              Daily Budget
                            </h4>
                            <div className="flex font-bold text-primary-600">
                              <DollarSign className="w-4" />

                              {/* ${calculateDayBudget(day.activities).toFixed(2)} */}
                              {day.budget?.planned || ''}
                            </div>
                          </div>}
                          <div className="text-sm text-gray-600">
                            Includes all activities, restaurants, and
                            accommodations for the day
                          </div>
                        </div>

                        {renderSection(day, index, "hotels")}
                        {renderSection(day, index, "activities")}
                        {renderSection(day, index, "restaurants")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DndContext>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="hidden md:block md:w-1/2 relative">
          <div ref={mapRef} className="absolute inset-0" />
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4">
                <p className="text-red-600 font-medium mb-2">
                  Unable to load map
                </p>
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

      <PlaceSearchModal
        isOpen={isPlaceSearchOpen}
        onClose={() => setIsPlaceSearchOpen(false)}
        onPlaceSelect={(place) => handlePlaceSelect(place, currentAddType)}
        mapCenter={mapInstanceRef.current?.getCenter()}
      />
    </div>
  );
}
