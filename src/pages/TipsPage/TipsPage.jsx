import React from 'react';
import { 
  Lightbulb, 
  DollarSign, 
  Compass, 
  Camera, 
  Backpack, 
  Utensils,
  Globe,
  Wifi,
  Shield,
  Plane,
  CreditCard,
  Phone
} from 'lucide-react';

const categories = [
  {
    icon: DollarSign,
    title: "Budget Travel",
    description: "Learn how to make the most of your travel budget with money-saving tips and tricks.",
    tips: [
      "Book flights mid-week for better deals",
      "Use local transportation instead of taxis",
      "Cook some meals instead of eating out",
      "Visit free attractions and museums",
      "Travel during shoulder season"
    ]
  },
  {
    icon: Compass,
    title: "Navigation",
    description: "Tips for finding your way around new places and using local transportation.",
    tips: [
      "Download offline maps before your trip",
      "Learn basic phrases in local language",
      "Get a local transit card for savings",
      "Use landmarks for orientation",
      "Keep your hotel's business card"
    ]
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Capture your travel memories with these essential photography tips.",
    tips: [
      "Shoot during golden hour",
      "Include people for scale",
      "Back up photos regularly",
      "Learn basic composition rules",
      "Respect local photo restrictions"
    ]
  },
  {
    icon: Backpack,
    title: "Packing",
    description: "Pack smarter with our comprehensive packing guides and checklists.",
    tips: [
      "Roll clothes to save space",
      "Pack versatile clothing items",
      "Bring a portable charger",
      "Keep valuables in carry-on",
      "Use packing cubes"
    ]
  }
];

const essentialTips = [
  {
    icon: Globe,
    title: "Research Your Destination",
    tips: [
      "Study local customs and etiquette",
      "Check visa requirements",
      "Research weather patterns",
      "Learn about local transportation",
      "Identify safe neighborhoods"
    ]
  },
  {
    icon: Wifi,
    title: "Stay Connected",
    tips: [
      "Get an international SIM card",
      "Download offline maps",
      "Save emergency contacts",
      "Back up important documents",
      "Use a VPN for security"
    ]
  },
  {
    icon: Shield,
    title: "Safety First",
    tips: [
      "Keep emergency contacts handy",
      "Get travel insurance",
      "Share itinerary with family",
      "Be aware of surroundings",
      "Keep copies of documents"
    ]
  }
];

const practicalAdvice = [
  {
    icon: Plane,
    title: "Flight Tips",
    content: "Book flights 2-3 months in advance for best deals. Consider flexible dates and nearby airports. Sign up for price alerts and airline newsletters."
  },
  {
    icon: CreditCard,
    title: "Money Matters",
    content: "Notify your bank of travel plans. Carry multiple payment methods. Use credit cards with no foreign transaction fees. Always have some local currency."
  },
  {
    icon: Phone,
    title: "Communication",
    content: "Download translation apps. Learn basic local phrases. Get an international phone plan or local SIM card. Save emergency numbers."
  }
];

export default function TipsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2340&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Travel Tips</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
              Expert advice to help you travel smarter, safer, and more enjoyably
            </p>
          </div>
        </div>
      </section>

      {/* Essential Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Essential Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {essentialTips.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.title}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-primary-600 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Travel Smart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.title}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-primary-600 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practical Advice */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Practical Travel Advice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practicalAdvice.map((advice) => {
              const Icon = advice.icon;
              return (
                <div 
                  key={advice.title}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">{advice.title}</h3>
                  </div>
                  <p className="text-gray-600">{advice.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}