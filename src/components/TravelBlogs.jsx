import React from 'react';
import { MapPin, Calendar, ArrowRight, Heart } from 'lucide-react';

const blogs = [
  {
    title: "Hidden Gems of Santorini",
    author: "Maria Kowalski",
    date: "March 15, 2024",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    excerpt: "Discover the lesser-known spots of this beautiful Greek island, from secret sunset viewpoints to authentic local tavernas."
  },
  {
    title: "A Week in the Swiss Alps",
    author: "James Chen",
    date: "March 12, 2024",
    location: "Zermatt, Switzerland",
    image: "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    excerpt: "Experience the magic of Swiss mountain villages, hiking trails, and world-class skiing in the shadow of the Matterhorn."
  },
  {
    title: "Tokyo After Dark",
    author: "Emma Wilson",
    date: "March 10, 2024",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    excerpt: "Explore the vibrant nightlife of Tokyo, from neon-lit streets to hidden izakayas and karaoke bars."
  }
];

export function TravelBlogs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Travel Stories & Inspiration
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing destinations and get inspired by real travel experiences from our community of global adventurers
          </p>
        </div>

        {/* Featured Blog */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-48 sm:h-64 lg:h-full">
                <img 
                  src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                  alt="Bali Rice Terraces"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>March 18, 2024</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4" />
                  <span>Bali, Indonesia</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  A Month in Bali: Digital Nomad's Paradise
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  From pristine beaches to lush rice terraces, discover why Bali is the perfect destination for remote workers and digital nomads. Learn about the best cafes, co-working spaces, and cultural experiences.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Sarah Johnson"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Digital Nomad & Writer</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.title}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{blog.date}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{blog.location}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    By {blog.author}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base">
            View All Stories
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}