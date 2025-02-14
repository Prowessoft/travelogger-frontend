import axiosInstance from '../utils/axiosConfig';

const formatItineraryPayload = (days, trip, user) => {
  const now = new Date().toISOString();
  const [lat, lng] = trip.destination?.coordinates || [null, null];

  // Calculate total budget
  const totalBudget = days?.reduce((total, day) => {
    return total + day.activities.reduce((dayTotal, activity) => {
      return dayTotal + (parseFloat(activity.price) || 0);
    }, 0);
  }, 0);

  // Estimate budget breakdown
  const accommodation = totalBudget * 0.4;
  const activities = totalBudget * 0.3;
  const dining = totalBudget * 0.2;
  const transport = totalBudget * 0.1;

  return {
    itinerary: {
      userId: user?.id,
      title: `${trip.destination?.label || 'Trip'} ${new Date(trip.startDate).getFullYear()}`,
      status: "draft",
      visibility: "private",
      createdAt: now,
      updatedAt: now,
      tripImg: trip.tripImg,
      tripDetails: {
        destination: {
          name: trip.destination?.label || ''
          // coordinates: [lat, lng]
        },
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: {
          currency: "USD",
          total: totalBudget,
          breakdown: {
            accommodation,
            activities,
            dining,
            transport
          }
        }
      },
      days: days.map((day, index) => {
        const dailyBudget = day.activities.reduce((total, activity) => {
          return total + (parseFloat(activity.price) || 0);
        }, 0);

        return {
          date: new Date(day.date).toISOString().split('T')[0],
          dayNumber: index + 1,
          budget: {
            planned: dailyBudget,
            actual: dailyBudget // Initially same as planned
          },
          sections: {
            hotels: day.activities
              .filter(activity => activity.type === 'hotel')
              .map(hotel => ({
                type: 'hotel',
                title: hotel.title,
                description: hotel.description || '',
                location: {
                  name: hotel.location?.name || '',
                  coordinates: hotel.location?.coordinates || [null, null],
                  placeId: hotel.googlePlaceId
                },
                startTime: hotel.startTime || null,
                endTime: hotel.endTime || null,
                duration: null,
                price: parseFloat(hotel.price) || 0,
                priceLevel: null,
                rating: hotel.rating || null,
                userRatingsTotal: hotel.userRatingsTotal || 0,
                photos: hotel?.photos && hotel?.photos?.length > 1 ? [hotel.photos[2]] : hotel.photos && hotel.photos.length > 0 ? [hotel.photos[1]] : [],
                contact: {
                  phone: hotel.phone || '',
                  website: hotel.website || '',
                  googleMapsUrl: hotel.url || ''
                },
                operatingHours: {
                  isOpen: hotel.isOpen || false,
                  periods: hotel?.formattedHours && hotel?.formattedHours[2] ? [hotel.formattedHours[2]] || [] : null
                }
              })),
            activities: day.activities
              .filter(activity => activity.type === 'activity')
              .map(activity => ({
                type: 'activity',
                title: activity.title,
                description: activity.description || '',
                location: {
                  name: activity.location?.name || '',
                  coordinates: activity.location?.coordinates || [null, null],
                  placeId: activity.googlePlaceId
                },
                startTime: activity.startTime || null,
                endTime: activity.endTime || null,
                duration: activity.duration || null,
                price: parseFloat(activity.price) || 0,
                priceLevel: null,
                rating: activity.rating || null,
                userRatingsTotal: activity.userRatingsTotal || 0,
                photos: activity?.photos && activity.photos.length > 1 ? [activity.photos[2]] : activity.photos &&  activity.photos.length > 0 ? [activity.photos[1]] : [],
                // activity.photos?.map(photo => ({
                  //   url: photo.url,
                  //   caption: photo.caption || ''
                // })) || [],
                contact: {
                  phone: activity.phone || '',
                  website: activity.website || '',
                  googleMapsUrl: activity.googleMapsUrl || ''
                },
                operatingHours: {
                  isOpen: activity.isOpen || false,
                  periods: activity?.formattedHours && activity?.formattedHours[2] ? [activity.formattedHours[2]] || [] : null
                }
              })),
            restaurants: day.activities
              .filter(activity => activity.type === 'restaurant')
              .map(restaurant => ({
                type: 'restaurant',
                title: restaurant.title,
                description: restaurant.description || '',
                location: {
                  name: restaurant.location?.name || '',
                  coordinates: restaurant.location?.coordinates || [null, null],
                  placeId: restaurant.googlePlaceId
                },
                startTime: restaurant.startTime || null,
                endTime: restaurant.endTime || null,
                duration: restaurant.duration || null,
                price: parseFloat(restaurant.price) || 0,
                priceLevel: null,
                rating: restaurant.rating || null,
                userRatingsTotal: restaurant.userRatingsTotal || 0,
                photos: restaurant?.photos && restaurant.photos.length > 1 ? [restaurant.photos[2]] : restaurant?.photos && restaurant.photos.length > 0 ? [restaurant.photos[1]] : [],
                // restaurant.photos?.map(photo => ({
                  //   url: photo.url,
                  //   caption: photo.caption || ''
                // })) || [],
                contact: {
                  phone: restaurant.phone || '',
                  website: restaurant.website || '',
                  googleMapsUrl: restaurant.googleMapsUrl || ''
                },
                operatingHours: {
                  isOpen: restaurant.isOpen || false,
                  periods: restaurant?.formattedHours && restaurant?.formattedHours[2] ? [restaurant.formattedHours[2]] || [] : null
                },
                cuisine: restaurant.cuisine || []
              }))
          }
        };
      }),
      metadata: {
        tags: [],
        isTemplate: false,
        language: "en",
        version: 1
      }
    }
  };
};

const itineraryService = {
  async saveItinerary(days, trip, user) {
    try {
      const payload = formatItineraryPayload(days, trip, user);
      const response = await axiosInstance.post('/itinerary/create', payload);
      return response.data;
    } catch (error) {
      console.error('Error saving itinerary:', error);
      throw error;
    }
  },

  async updateItinerary(itineraryId, days, trip, user) {
    try {
      const payload = formatItineraryPayload(days, trip, user);
      const response = await axiosInstance.post(`/itinerary/update/${itineraryId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error saving itinerary:', error);
      throw error;
    }
  },

  async getItinerary(id) {
    try {
      const response = await axiosInstance.get(`/getItinerary/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      throw error;
    }
  },

  async getUserItineraries(userId) {
    try {
      // const payload = formatItineraryPayload(days, trip, user);
      const response = await axiosInstance.get(`/getItineraries/basic/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error saving itinerary:', error);
      throw error;
    }
  }
};

export default itineraryService;