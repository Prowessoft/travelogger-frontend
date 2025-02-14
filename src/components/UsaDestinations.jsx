import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const destinations = [
  {
    name: "New York City",
    state: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2340&q=80",
    highlights: ["Times Square", "Central Park", "Empire State Building", "Broadway Shows"]
  },
  {
    name: "San Francisco",
    state: "California",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2340&q=80",
    highlights: ["Golden Gate Bridge", "Alcatraz", "Fisherman's Wharf", "Cable Cars"]
  },
  {
    name: "Las Vegas",
    state: "Nevada",
    image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=2340&q=80",
    highlights: ["The Strip", "Fremont Street", "Shows & Entertainment", "World-class Dining"]
  },
  {
    name: "Miami",
    state: "Florida",
    image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2340&q=80",
    highlights: ["South Beach", "Ocean Drive", "Art Deco District", "Little Havana"]
  },
  {
    name: "Grand Canyon",
    state: "Arizona",
    image: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=2340&q=80",
    highlights: ["South Rim", "Bright Angel Trail", "Desert View Drive", "Sunset Points"]
  }
];

export function UsaDestinations() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore the USA
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            From bustling cities to natural wonders, discover the most iconic destinations across America
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[250px] sm:auto-rows-[300px]">
          {destinations.map((destination, index) => (
            <div 
              key={destination.name}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? 'sm:col-span-2 lg:col-span-8 lg:row-span-2' : 
                index === 1 ? 'lg:col-span-4' :
                'lg:col-span-4'
              } ${index === 0 ? 'lg:h-[600px]' : ''}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <img 
                src={destination.image} 
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-white/80 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{destination.state}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{destination.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight) => (
                      <span 
                        key={highlight}
                        className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                    Explore More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base">
            View All Destinations
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}