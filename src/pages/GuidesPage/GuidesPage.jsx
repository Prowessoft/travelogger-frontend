import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, Star, Info, Navigation } from 'lucide-react';
import { GuideModal } from '../../components/GuideModal';

const worldGuides = [
  {
    id: "bali-adventure",
    title: "Bali Island Paradise",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2340&q=80",
    description: "Discover the magic of Bali through its ancient temples, lush rice terraces, and vibrant culture. This comprehensive guide takes you through the best of what the Island of Gods has to offer.",
    duration: "14 days",
    location: "Bali, Indonesia",
    bestTime: "Apr-Oct",
    budget: "$1,500-2,500",
    rating: 4.8,
    highlights: [
      "Explore ancient temples in Ubud",
      "Visit the iconic rice terraces",
      "Surf in Canggu",
      "Sunset at Tanah Lot",
      "Snorkel in Nusa Penida"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Seminyak",
        description: "Begin your Bali adventure in the stylish beach town of Seminyak",
        activities: [
          "Airport transfer to hotel",
          "Welcome dinner at a beachfront restaurant",
          "Evening walk along Seminyak Beach"
        ]
      },
      {
        day: 2,
        title: "Exploring Ubud",
        description: "Immerse yourself in Balinese culture in Ubud",
        activities: [
          "Morning yoga session",
          "Visit to Monkey Forest",
          "Traditional art galleries tour",
          "Evening dance performance"
        ]
      }
    ],
    tips: [
      "Book accommodations in advance during peak season",
      "Respect local customs and dress modestly at temples",
      "Always carry cash as not all places accept cards",
      "Use ride-hailing apps for convenient transportation"
    ]
  },
  {
    id: "japan-essentials",
    title: "Japan: Modern Meets Traditional",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2340&q=80",
    description: "Experience the perfect blend of ancient traditions and cutting-edge technology in Japan. From serene temples to bustling city streets, this guide covers everything you need to know.",
    duration: "10 days",
    location: "Japan",
    bestTime: "Mar-May, Oct-Nov",
    budget: "$2,500-3,500",
    rating: 4.9,
    highlights: [
      "Tokyo's vibrant neighborhoods",
      "Historic temples in Kyoto",
      "Mount Fuji views",
      "Bullet train experience",
      "Traditional ryokan stay"
    ],
    itinerary: [
      {
        day: 1,
        title: "Tokyo Exploration",
        description: "Dive into the energy of Tokyo",
        activities: [
          "Morning visit to Tsukiji Outer Market",
          "Explore Shibuya Crossing",
          "Shopping in Harajuku",
          "Evening in Shinjuku"
        ]
      }
    ],
    tips: [
      "Get a JR Pass for intercity travel",
      "Download offline maps and translation apps",
      "Learn basic Japanese phrases",
      "Consider pocket WiFi rental"
    ]
  },
  {
    id: "paris-romance",
    title: "Paris: City of Light & Love",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2340&q=80",
    description: "Discover the magic of Paris through its iconic landmarks, world-class cuisine, and charming neighborhoods. A complete guide to experiencing the romance of the French capital.",
    duration: "7 days",
    location: "Paris, France",
    bestTime: "Apr-Jun, Sep-Oct",
    budget: "$2,000-3,000",
    rating: 4.7,
    highlights: [
      "Eiffel Tower experience",
      "Louvre Museum tour",
      "Seine River cruise",
      "Montmartre walks",
      "French cuisine workshops"
    ]
  },
  {
    id: "santorini-escape",
    title: "Santorini: Greek Island Paradise",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2340&q=80",
    description: "Experience the stunning beauty of Santorini's white-washed buildings, blue domes, and spectacular sunsets. Your guide to the most romantic Greek island.",
    duration: "5 days",
    location: "Santorini, Greece",
    bestTime: "May-Oct",
    budget: "$1,800-2,800",
    rating: 4.9,
    highlights: [
      "Oia sunset views",
      "Caldera boat tour",
      "Wine tasting",
      "Black sand beaches",
      "Ancient Akrotiri ruins"
    ]
  },
  {
    id: "iceland-adventure",
    title: "Iceland: Land of Fire and Ice",
    image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=2340&q=80",
    description: "Explore Iceland's dramatic landscapes, from glaciers to volcanoes, hot springs to waterfalls. A comprehensive guide to the ultimate nature adventure.",
    duration: "8 days",
    location: "Iceland",
    bestTime: "Jun-Aug, Dec-Mar",
    budget: "$3,000-4,000",
    rating: 4.8,
    highlights: [
      "Northern Lights viewing",
      "Golden Circle tour",
      "Blue Lagoon experience",
      "Glacier hiking",
      "Whale watching"
    ]
  },
  {
    id: "thailand-discovery",
    title: "Thailand: Tropical Paradise",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2340&q=80",
    description: "From bustling Bangkok to serene beaches, explore the best of Thailand's culture, cuisine, and natural beauty. Your complete guide to the Land of Smiles.",
    duration: "12 days",
    location: "Thailand",
    bestTime: "Nov-Apr",
    budget: "$1,200-2,200",
    rating: 4.7,
    highlights: [
      "Bangkok temples",
      "Phi Phi Islands",
      "Chiang Mai night markets",
      "Elephant sanctuaries",
      "Thai cooking classes"
    ]
  },
  {
    id: "new-zealand-adventure",
    title: "New Zealand: Ultimate Road Trip",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2340&q=80",
    description: "Journey through Middle Earth with this comprehensive road trip guide covering both North and South Islands. Experience New Zealand's breathtaking landscapes and Maori culture.",
    duration: "15 days",
    location: "New Zealand",
    bestTime: "Dec-Feb",
    budget: "$3,500-4,500",
    rating: 4.9,
    highlights: [
      "Milford Sound cruise",
      "Hobbiton Movie Set",
      "Rotorua hot springs",
      "Queenstown adventures",
      "Franz Josef Glacier"
    ]
  },
  {
    id: "morocco-magic",
    title: "Morocco: Desert & Medinas",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2340&q=80",
    description: "From the bustling souks of Marrakech to the silent Sahara Desert, discover the diverse landscapes and rich culture of Morocco. A journey through time and tradition.",
    duration: "9 days",
    location: "Morocco",
    bestTime: "Mar-May, Sep-Nov",
    budget: "$1,500-2,500",
    rating: 4.6,
    highlights: [
      "Marrakech Medina",
      "Sahara Desert camping",
      "Atlas Mountains trek",
      "Fes ancient city",
      "Coastal Essaouira"
    ]
  }
];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGuide = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  const handleGetDirections = (location) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2340&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Travel Guides</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
              Comprehensive guides to help you plan your next adventure
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worldGuides.map((guide) => (
              <div 
                key={guide.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{guide.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{guide.location}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => openGuide(guide)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Info className="w-4 h-4" />
                      View Guide
                    </button>
                    <button
                      onClick={() => handleGetDirections(guide.location)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Modal */}
      {selectedGuide && (
        <GuideModal
          guide={selectedGuide}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}