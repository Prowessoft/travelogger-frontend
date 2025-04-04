import { getMapsLoader } from '../utils/mapsLoader';

const FALLBACK_IMAGES = {
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1000&q=80'
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80'
  ],
  activity: [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'
  ]
};

const getRandomFallbackImage = (type) => {
  const images = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
  return images[Math.floor(Math.random() * images.length)];
};

const getPhotoForLocationOrPlace = async ({ name, type = 'default', location = '' }) => {
  try {
    const loader = getMapsLoader();
    await loader.load();

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const query = location ? `${name}, ${location}` : name;

    const result = await new Promise((resolve, reject) => {
      service.findPlaceFromQuery(
        {
          query,
          fields: ['name', 'place_id', 'photos', 'formatted_address'],
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`No result found for query: ${query}`));
          }
        }
      );
    });

    if (result?.photos?.length) {
      return result.photos[0].getUrl({ maxWidth: 1200 });
    }

    return getRandomFallbackImage(type);
  } catch (error) {
    console.warn(`Photo fetch failed for "${name}" (${type})`, error);
    return getRandomFallbackImage(type);
  }
};

export const enrichItineraryWithPhotos = async (tripPlan) => {
  if (!tripPlan?.tripDetails?.destination) {
    console.error('Invalid trip plan or missing location');
    return tripPlan;
  }

  const enrichedPlan = { ...tripPlan };
  const { name } = tripPlan.tripDetails?.destination;

  try {
    // Enrich hotels
    // if (Array.isArray(enrichedPlan.hotels)) {
    //   enrichedPlan.hotels = await Promise.all(
    //     enrichedPlan.hotels.map(async (hotel) => ({
    //       ...hotel,
    //       imageUrl: await getPlacePhoto(hotel.name, 'hotel', name)
    //     }))
    //   );
    // }

    // Ensure dailyItinerary is an array
    enrichedPlan.days = Array.isArray(enrichedPlan.days)
      ? enrichedPlan.days
      : Object.values(enrichedPlan.days);

    // Enrich daily itinerary
    enrichedPlan.days = await Promise.all(
      enrichedPlan.days.map(async (day) => {
        // Enrich activities
        const activities = Array.isArray(day.sections.activities)
          ? await Promise.all(
              day.sections.activities.map(async (activity) => ({
                ...activity,
                photos: await getPhotoForLocationOrPlace(activity.name, 'activity', name)
              }))
            )
          : [];
         // Enrich hotels
          const hotels = Array.isArray(day.sections.hotels)
          ? await Promise.all(
              day.sections.hotels.map(async (hotel) => ({
                ...hotel,
                photos: await getPhotoForLocationOrPlace(hotel.name, 'hotel', name)
              }))
            )
          : [];

        // Enrich restaurants
        const restaurants = Array.isArray(day.sections.restaurants)
          ? await Promise.all(
              day.sections.restaurants.map(async (restaurant) => ({
                ...restaurant,
                photos: await getPhotoForLocationOrPlace(restaurant.name, 'restaurant', name)
              }))
            )
          : [];
        

        day.sections = {
          ...day.sections,
          activities,
          hotels,
          restaurants
        };
        return day;
      })
    );

    return enrichedPlan;
  } catch (error) {
    console.error('Error enriching itinerary with photos:', error);
    return enrichedPlan; // Return the original plan if photo enrichment fails
  }
};