import React from 'react';
import { X, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

/**
 * @param {Object} props
 * @param {import('../types/guide').Guide} props.guide
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 */
export function GuideModal({ guide, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1">{guide.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Hero Image */}
          <img 
            src={guide.image} 
            alt={guide.title}
            className="w-full h-48 sm:h-[300px] md:h-[400px] object-cover rounded-xl mb-6"
          />
          
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 truncate">{guide.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600">{guide.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600">{guide.bestTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600">{guide.budget}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            {/* Overview */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Overview</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{guide.description}</p>

            {/* Highlights */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Highlights</h3>
            <ul className="list-disc pl-4 sm:pl-6 mb-6 space-y-2">
              {guide.highlights.map((highlight, index) => (
                <li key={index} className="text-sm sm:text-base text-gray-600">{highlight}</li>
              ))}
            </ul>

            {/* Itinerary */}
            {guide.itinerary.map((day, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Day {day.day}: {day.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{day.description}</p>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="text-sm sm:text-base text-gray-600">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Tips */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Travel Tips</h3>
            <ul className="list-disc pl-4 sm:pl-6 mb-6 space-y-2">
              {guide.tips.map((tip, index) => (
                <li key={index} className="text-sm sm:text-base text-gray-600">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}