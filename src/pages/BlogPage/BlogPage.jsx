import React from 'react';
import { TravelBlogs } from '../../components/TravelBlogs';

export default function BlogPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Travel Blog</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
              Stories and inspiration from travelers around the world
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <TravelBlogs />
    </div>
  );
}