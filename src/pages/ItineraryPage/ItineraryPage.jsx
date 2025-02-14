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
    des?.label?.split(",")[0].toLowerCase().includes(key)
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const calculateDayBudget = (activities) => {
    return activities.reduce((total, activity) => {
      if (!activity.price) return total;

      // Extract numeric value from price string
      const price = activity.price.replace(/[^0-9.]/g, "");
      return total + (parseFloat(price) || 0);
    }, 0);
  };

  const calculateTotalBudget = () => {
    return days.reduce((total, day) => {
      return total + calculateDayBudget(day.activities);
    }, 0);
  };

  useEffect(() => {
    const loadSavedItinerary = async () => {
      if (!itineraryId) {
        // if (!trip) {
        //   navigate('/plan-trip');
        // }
        return;
      }

      try {
        setLoading(true);
        const savedItinerary = await itineraryService.getItinerary(itineraryId);

        // Set trip data
        setTrip({
          destination: savedItinerary.tripDetails.destination.name,
          tripImg: getDestinationImage(savedItinerary.tripDetails.destination),
          startDate: savedItinerary.tripDetails.startDate,
          endDate: savedItinerary.tripDetails.endDate,
          id: savedItinerary.id,
        });

        // Transform days data
        const transformedDays = savedItinerary.days.map((day) => {
          const activities = [
            ...(day.sections.hotels?.map((hotel) => ({
              ...hotel,
              type: "hotel",
            })) || []),
            ...(day.sections.activities?.map((activity) => ({
              ...activity,
              type: "activity",
            })) || []),
            ...(day.sections.restaurants?.map((restaurant) => ({
              ...restaurant,
              type: "restaurant",
            })) || []),
          ];

          return {
            date: day.date,
            activities,
          };
        });
        // setDaysData(transformedDays);
        initializeDays(transformedDays);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load itinerary:", error);
        toast.error("Failed to load itinerary");
        navigate("/plan-trip");
      }
    };

    loadSavedItinerary();
    // }, [itineraryId, trip, setTrip, initializeDays, navigate]);
  }, [itineraryId, initializeDays, navigate]);

  useEffect(() => {
    if (!trip || itineraryId) {
      // navigate('/plan-trip');
      console.log("inside:::");
      return;
    }

    // Initialize days based on trip dates
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const initialDays = Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      return {
        date: date.toISOString(),
        activities: [],
      };
    });

    initializeDays(initialDays);
    // setDaysData(days ? days : initialDays);

    // if (days !== daysData) {
    //   setDaysData(days);
    // }
  }, [trip, navigate, initializeDays]);

  useEffect(() => {
    const setupMap = async () => {
      try {
        if (!trip) {
          // navigate('/plan-trip');
          return;
        }

        const loader = getMapsLoader();
        await loader.load();

        const geocoder = new google.maps.Geocoder();
        const destination =
          typeof trip.destination === "object"
            ? trip.destination.label
            : trip.destination;

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
              day.hotels?.forEach((hotel) => {
                addMarker(hotel.address, hotel.name, "blue");
              });

              day.activities?.forEach((activity) => {
                if (activity.location?.name) {
                  addMarker(activity.location.name, activity.name, "red");
                }
              });

              day.restaurants?.forEach((restaurant) => {
                if (restaurant.address) {
                  addMarker(restaurant.address, restaurant.name, "yellow");
                }
              });
            });
          }
        });

        // Add activities and restaurants
        // plan.dailyItinerary?.forEach(day => {

        setLoading(false);
      } catch (error) {
        console.error("Map initialization failed:", error);
        setMapError(error.message);
        setLoading(false);
      }
    };

    setupMap();
  }, [trip, navigate]);

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
      id: Math.random().toString(36).substr(2, 9),
      title: place.title,
      description: place.description,
      location: place.location,
      type,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      priceLevel: place.priceLevel,
      website: place.website,
      formatted_phone_number: place.formatted_phone_number,
      url: place.url,
      formattedHours: place.formattedHours,
      isOpen: place.isOpen,
      photos: place.photos,
    };

    addActivity(selectedDay, newItem);
    // daysData.map((day, index) => {
    //   if (index === selectedDay) {
    //     day.activities.push(newItem);
    //   }
    // });
    // setDaysData(daysData);
    // setIsPlaceSearchOpen(false);
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
      // attach trip image to trip
      trip.tripImg = getDestinationImage(trip.destination);
      if (itineraryId) {
        // await itineraryService.updateItinerary(itineraryId, daysData, trip, user);
        await itineraryService.updateItinerary(itineraryId, days, trip, user);
        // return;
      } else {
        await itineraryService.saveItinerary(days, trip, user);
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
    const items = day.activities.filter((activity) => activity.type === type);
    const icon =
      type === "hotel" ? (
        <Hotel className="w-5 h-5 text-primary-600" />
      ) : type === "restaurant" ? (
        <Utensils className="w-5 h-5 text-primary-600" />
      ) : (
        <Coffee className="w-5 h-5 text-primary-600" />
      );

    const title =
      type === "hotel"
        ? "Hotels"
        : type === "restaurant"
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
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item, itemIndex) => (
              <SortableActivityItem
                key={item.id}
                activity={item}
                onRemove={() => removeActivity(dayIndex, item.id)}
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
        <div className="w-1/2 h-full overflow-y-auto">
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
                        trip.destination?.label || trip.destination
                      } Trip`
                    : "Plan Your Trip"}
                </h1>
                {trip && (
                  <div className="flex items-center justify-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {/* {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} */}
                        {new Date(
                          `${trip.startDate}T00:00:00`
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          `${trip.endDate}T00:00:00`
                        ).toLocaleDateString()}
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
                      <div className="text-lg font-bold text-primary-600">
                        ${calculateTotalBudget().toFixed(2)}
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
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {day.activities.length}{" "}
                            {day.activities.length === 1 ? "item" : "items"}
                          </span>
                          <div className="flex items-center gap-1 text-primary-600">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ${calculateDayBudget(day.activities).toFixed(2)}
                            </span>
                          </div>
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
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              Daily Budget
                            </h4>
                            <div className="text-lg font-bold text-primary-600">
                              ${calculateDayBudget(day.activities).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Includes all activities, restaurants, and
                            accommodations for the day
                          </div>
                        </div>

                        {renderSection(day, index, "hotel")}
                        {renderSection(day, index, "activity")}
                        {renderSection(day, index, "restaurant")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DndContext>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-1/2 relative">
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
