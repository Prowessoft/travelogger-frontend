import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, ThumbsUp, Home, ArrowRight, Clock, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';

const samplePosts = [
  {
    id: 1,
    type: 'experience',
    title: "Hidden Gems of Bali: Beyond the Tourist Trail",
    author: {
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    },
    location: "Bali, Indonesia",
    date: "2024-03-15",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1920&q=80"
    ],
    description: "After spending a month exploring the hidden corners of Bali, I discovered some truly magical places off the beaten path. From secret waterfalls to pristine beaches untouched by mass tourism, these spots showcase the raw beauty of the Island of Gods."
  },
  {
    id: 2,
    type: 'hitchhike',
    title: "Paris to Barcelona: Scenic Coastal Route",
    author: {
      name: "Alex Thompson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    },
    location: "Paris, France",
    destination: "Barcelona, Spain",
    date: "2024-03-20",
    time: "08:00",
    seats: 2,
    description: "Taking the scenic coastal route from Paris to Barcelona, stopping at charming towns along the way. Looking for travel companions to share fuel costs and adventures."
  },
  {
    id: 3,
    type: 'couchsurf',
    title: "Photographer Seeking Local Experience in Tokyo",
    author: {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    location: "Tokyo, Japan",
    date: "2024-04-01",
    duration: "3 nights",
    description: "Documentary photographer working on a project about urban culture. Looking for a host who can provide insights into local life. Happy to share stories and cook meals from my travels in exchange for your hospitality."
  },
  {
    id: 4,
    type: 'experience',
    title: "A Journey Through the Scottish Highlands: Castles, Lochs, and Legends",
    author: {
      name: "Michael O'Connor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    location: "Scottish Highlands, UK",
    date: "2024-03-18",
    images: [
      "https://images.unsplash.com/photo-1506670053666-34e1a9fcd6d7?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1580381728525-8e6c1fb40c1e?auto=format&fit=crop&w=1920&q=80"
    ],
    description: `Two weeks in the Scottish Highlands changed my perspective on what true wilderness means. As I ventured through this rugged landscape, each day brought new wonders and unexpected discoveries that words can barely capture.

The journey began at the historic Eilean Donan Castle, its ancient stones reflecting in the still waters of the loch at sunrise. The morning mist clung to the mountains, creating an ethereal atmosphere that transported me back through centuries of Scottish history. Local guides shared tales of clan warfare and legendary battles that once raged across these very grounds.

Heading north into the heart of the Highlands, I discovered hidden glens where red deer roamed freely and golden eagles soared overhead. The raw beauty of Glencoe left me speechless – massive peaks rising dramatically from the valley floor, their slopes still bearing the scars of ancient volcanic activity. Here, I learned about the tragic Glencoe Massacre, a somber reminder of the region's complex past.

One of the most memorable experiences was hiking the remote trails of the Trotternish Ridge on the Isle of Skye. The otherworldly landscapes of the Quiraing and Old Man of Storr seemed to belong more to a fantasy novel than reality. Local shepherds I met along the way shared stories passed down through generations, speaking of faeries and shape-shifting seals called selkies.

The Highland hospitality I encountered was extraordinary. In tiny villages and remote bothies, I was welcomed with warm smiles, hearty meals, and drams of whisky. Each evening brought new friendships and conversations that lasted long into the night, accompanied by traditional music and impromptu ceilidh dances.

A particular highlight was joining a local family for their annual sheep gathering. Watching skilled shepherds and their dogs work in perfect harmony across the mountainsides was a masterclass in traditional farming methods that have remained unchanged for centuries. The day ended with a community celebration that gave me a genuine glimpse into Highland life.

The weather was as dramatic as the landscape – four seasons in a day is no exaggeration here. I learned to embrace the ever-changing conditions, understanding that the interplay of sun, rain, and mist creates the very essence of Highland beauty. The rapidly shifting light transformed familiar scenes into entirely new landscapes every few minutes.

My journey concluded at a small coastal village where I spent days photographing the wild seas and rugged cliffs. Local fishermen shared tales of their ancestors and the changing nature of their traditional way of life. Their stories were a poignant reminder of how these communities maintain their cultural identity while adapting to the modern world.

This experience taught me that the Scottish Highlands are more than just stunning scenery – they're a living, breathing testament to the endurance of both nature and human culture. Every stone, every loch, and every mountain tells a story. The landscape itself is a keeper of memories, preserving the echoes of ancient tales and traditions.

As I left the Highlands, I carried with me not just photographs and memories, but a deep appreciation for this remarkable corner of the world where the past feels as tangible as the present. It's a place that reminds us of our connection to the land and the importance of preserving these wild spaces for future generations.`
  }
];

const ImageScroller = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-square">
      {/* Images */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Travel photo ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-3' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

const FullPostModal = ({ post, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 py-8">
        <div 
          className="max-w-3xl mx-auto bg-white rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Author header */}
          <div className="p-4 flex items-center gap-3 border-b">
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{post.author.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{post.location}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="relative aspect-video">
              <img
                src={post.images[currentImageIndex]}
                alt={`Travel photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white w-4' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
            <div className="prose max-w-none">
              {post.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);

  const getPostIcon = (type) => {
    switch (type) {
      case 'experience':
        return <Camera className="w-4 h-4" />;
      case 'hitchhike':
        return <ThumbsUp className="w-4 h-4" />;
      case 'couchsurf':
        return <Home className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderPostContent = (post) => {
    switch (post.type) {
      case 'experience':
        return (
          <div>
            {post.images && post.images.length > 0 && (
              <ImageScroller images={post.images} />
            )}
          </div>
        );
      case 'hitchhike':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.time}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {post.seats} seats
            </div>
          </div>
        );
      case 'couchsurf':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{post.duration}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[300px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=2340&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Share Your Travel Stories</h1>
            <button
              onClick={() => navigate('/create-post')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-base font-medium"
            >
              Share Your Experience
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Post Types */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/create-post?type=experience')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium">Experience</span>
            </button>
            <button 
              onClick={() => navigate('/create-post?type=hitchhike')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ThumbsUp className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium">Hitchhike</span>
            </button>
            <button 
              onClick={() => navigate('/create-post?type=couchsurf')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium">Couchsurf</span>
            </button>
          </div>
        </div>
      </section>

      {/* Posts Feed */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-xl mx-auto px-4">
          <div className="space-y-6">
            {samplePosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                {/* Author Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{post.author.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    {getPostIcon(post.type)}
                    <span className="text-xs font-medium text-gray-700 capitalize">{post.type}</span>
                  </div>
                </div>

                {/* Post Content */}
                {renderPostContent(post)}

                {/* Post Info */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Post Modal */}
      {selectedPost && (
        <FullPostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
}