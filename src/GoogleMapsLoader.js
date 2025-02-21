import { useEffect } from "react";

const loadGoogleMapsScript = (apiKey) => {
  if (!apiKey) {
    console.error("Google Maps API key is missing");
    return;
  }
  console.log('maps document:::')
  const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,geocoding`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

const GoogleMapsLoader = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    loadGoogleMapsScript(apiKey);
  }, []);

  return null; // This component only loads the script, so it doesn't render anything
};

export default GoogleMapsLoader;
