import React from 'react';
import { Lightbulb, DollarSign, Compass, Camera, Backpack, Utensils } from 'lucide-react';

const categories = [
  {
    icon: DollarSign,
    title: "Budget Travel",
    description: "Learn how to make the most of your travel budget with money-saving tips and tricks."
  },
  {
    icon: Compass,
    title: "Navigation",
    description: "Tips for finding your way around new places and using local transportation."
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Capture your travel memories with these essential photography tips."
  },
  {
    icon: Backpack,
    title: "Packing",
    description: "Pack smarter with our comprehensive packing guides and checklists."
  },
  {
    icon: Utensils,
    title: "Food & Dining",
    description: "Discover local cuisines and find the best places to eat while traveling."
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80")'
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

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.title}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tip */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary-100 p-3 rounded-full">
                <Lightbulb className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tip of the Day</h2>
            </div>
            <div className="max-w-3xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Always Keep Digital Copies of Important Documents
              </h3>
              <p className="text-gray-600 mb-6">
                Before your trip, scan or take photos of your passport, ID, insurance cards, and other important documents. Store them securely in cloud storage or email them to yourself. This can be a lifesaver if you lose the physical copies while traveling.
              </p>
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Read More Tips
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}