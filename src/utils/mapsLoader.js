import { Loader } from '@googlemaps/js-api-loader';

let loader = null;
let loadPromise = null;

function getMapsLoader() {
  if (!loader) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places", "geometry", "geocoding"],
      region: 'US',
      retries: 3,
      language: 'en'
    });
  }

  // Return a singleton promise
  if (!loadPromise) {
    loadPromise = loader.load().catch(error => {
      console.error('Error loading Google Maps:', error);
      loadPromise = null; // Reset promise on error
      throw error;
    });
  }

  return {
    load: () => loadPromise,
    loader
  };
}

// Check if Google Maps is already loaded
function isGoogleMapsLoaded() {
  return typeof google !== 'undefined' && google.maps;
}

// Wait for Google Maps to be available with timeout
async function waitForGoogleMaps(timeout = 10000) {
  if (isGoogleMapsLoaded()) {
    return google.maps;
  }

  const start = Date.now();

  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve(google.maps);
        return;
      }

      if (Date.now() - start > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Google Maps load timeout'));
        return;
      }
    }, 100);
  });
}

export {
  getMapsLoader,
  isGoogleMapsLoaded,
  waitForGoogleMaps
};