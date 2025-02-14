import React from 'react';
import { MapPin, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const wonders = [
  {
    name: "Great Wall of China",
    location: "China",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    description: "An ancient series of walls and fortifications spanning over 13,000 miles, built as early as the 7th century BCE.",
    wikiUrl: "https://en.wikipedia.org/wiki/Great_Wall_of_China"
  },
  {
    name: "Petra",
    location: "Jordan",
    image: "https://images.unsplash.com/photo-1579606037885-46c0ee5d0c67?auto=format&fit=crop&w=1200&q=80",
    description: "An ancient city carved into rose-colored rock face, featuring stunning architecture and water conduit systems.",
    wikiUrl: "https://en.wikipedia.org/wiki/Petra"
  },
  {
    name: "Christ the Redeemer",
    location: "Brazil",
    image: "https://images.unsplash.com/photo-1594387295585-34ba4c251eea?auto=format&fit=crop&w=1200&q=80",
    description: "An Art Deco statue of Jesus Christ standing 98 feet tall, overlooking Rio de Janeiro.",
    wikiUrl: "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)"
  },
  {
    name: "Machu Picchu",
    location: "Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
    description: "A 15th-century Inca citadel set high in the Andes Mountains, showcasing incredible ancient architecture and engineering.",
    wikiUrl: "https://en.wikipedia.org/wiki/Machu_Picchu"
  },
  {
    name: "Chichen Itza",
    location: "Mexico",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80",
    description: "A pre-Columbian city built by the Maya civilization, featuring the iconic El Castillo pyramid temple.",
    wikiUrl: "https://en.wikipedia.org/wiki/Chichen_Itza"
  },
  {
    name: "Taj Mahal",
    location: "India",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    description: "A stunning ivory-white marble mausoleum built in the 17th century, symbol of eternal love and architectural perfection.",
    wikiUrl: "https://en.wikipedia.org/wiki/Taj_Mahal"
  },
  {
    name: "Colosseum",
    location: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "The largest ancient amphitheater ever built, this iconic symbol of Rome once hosted gladiatorial contests and public spectacles.",
    wikiUrl: "https://en.wikipedia.org/wiki/Colosseum"
  }
];

export function Wonders() {
  const navigate = useNavigate();

  const handlePlanVisit = (destination) => {
    navigate('/plan-trip', { state: { destination: `${destination.name}, ${destination.location}` } });
  };

  const handleLearnMore = (wikiUrl) => {
    window.open(wikiUrl, '_blank');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The 7 Wonders of the World
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore these magnificent monuments that showcase human ingenuity and natural beauty
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {wonders.map((wonder) => (
            <div 
              key={wonder.name}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img 
                  src={wonder.image} 
                  alt={wonder.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{wonder.location}</span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{wonder.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{wonder.description}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button 
                    onClick={() => handlePlanVisit(wonder)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Plan Visit
                  </button>
                  <button 
                    onClick={() => handleLearnMore(wonder.wikiUrl)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}