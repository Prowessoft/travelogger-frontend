import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, 
  Trash2, 
  GripVertical, 
  MapPin, 
  Timer, 
  Route, 
  Calendar, 
  DollarSign, 
  Save, 
  X,
  AlertCircle,
  Link as LinkIcon,
  Star,
  Navigation,
  Phone
} from 'lucide-react';
import { calculateDistance, calculateTravelTime } from '../utils/distanceCalculator';

export function SortableActivityItem({ activity, onRemove, number, nextActivity }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: activity.title,
    startTime: activity.startTime || '',
    endTime: activity.endTime || '',
    notes: activity.notes || '',
    price: activity.price || '',
    url: activity.url || ''
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dayHours, setDayHours] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=24&q=24';

  useEffect(() => {
    if (activity.formattedHours?.length) {
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const hours = activity.formattedHours.find(day => day.day === currentDay);
      setDayHours(hours);
    } else {
      // activity.operatingHours.periods[0].map(day => ({
      //   day: day.split(': ')[0],
      //   hours: day.split(': ')[1]
      // })) || []
    }
  }, [activity.formattedHours]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    Object.assign(activity, formData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setFormData({
      title: activity.title,
      startTime: activity.startTime || '',
      endTime: activity.endTime || '',
      notes: activity.notes || '',
      price: activity.price || '',
      url: activity.url || ''
    });
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const validateTimes = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      return end > start;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTimes()) {
      alert('End time must be after start time');
      return;
    }
    handleSave();
  };

  const travelInfo = React.useMemo(() => {
    if (nextActivity?.location?.coordinates && activity?.location?.coordinates) {
      const [lat1, lon1] = activity.location.coordinates;
      const [lat2, lon2] = nextActivity.location.coordinates;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      const minutes = calculateTravelTime(distance);
      
      return {
        distance,
        minutes
      };
    }
    return null;
  }, [activity, nextActivity]);

  return (
    
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-gray-50 rounded-lg group relative hover:bg-gray-100 transition-colors ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
        {/* Activity Number */}
        <div 
          className="absolute -left-2 -top-2 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-sm"
          aria-label={`Activity ${number}`}
        >
          {number}
        </div>

        <div className="flex">
          {/* Image */}
          {/* {activity.photos?.[0]?.url && ( */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={activity?.photos ? activity?.photos[0]?.url : defaultImage}
                alt={activity.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
          {/* )} */}

          {/* Content */}
          <div className="flex-1 p-3">
            <div className="flex items-start gap-2">
              <button
                type="button"
                {...attributes}
                {...listeners}
                className="mt-1 text-gray-400 hover:text-gray-600 cursor-move touch-none p-1 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Drag to reorder activity"
              >
                <GripVertical className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label htmlFor={`title-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Activity Title
                      </label>
                      <input
                        id={`title-${activity.id}`}
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter activity title"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`start-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          id={`start-${activity.id}`}
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`end-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          id={`end-${activity.id}`}
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`price-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          id={`price-${activity.id}`}
                          type="text"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label htmlFor={`url-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          id={`url-${activity.id}`}
                          type="url"
                          value={formData.url}
                          onChange={(e) => handleInputChange('url', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`notes-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        id={`notes-${activity.id}`}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder="Add any notes or details"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!hasUnsavedChanges}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {activity.title}
                      </h3>
                      {
                      // activity.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-600">{activity.rating || 'N/A'}</span>
                        </div>
                      // )
                      }
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      {activity.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{activity.location.name}</span>
                        </div>
                      )}
                      {
                      // dayHours && (
                        // <div className="flex items-center">
                        //   <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        //   <span>{dayHours?.hours || 'open 24 hours'}</span>
                        // </div>
                      // )
                      }
                      {
                      // activity.priceLevel && (
                        <div className="flex items-center"> 
                        {/* <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />         */}
                          <span>{activity.priceLevel == 0 ? 'default price value' : activity.priceLevel}</span>
                        </div>
                      // )
                      }
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                    {/* (activity?.url || activity?.contact?.googleMapsUrl) && */}
                      {(
                        <button
                          onClick={() => window.open(activity?.url || activity?.contact?.googleMapsUrl || 'http://google.com', '_blank')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </button>
                      )}
                      {/* (activity?.website || activity?.contact?.website) &&  */}
                      {(
                        <a
                          href={activity?.website || activity?.contact?.website || 'http://google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <LinkIcon className="w-3 h-3" />
                          Website
                        </a>
                       )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onRemove(activity.id)}
                className="text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-200"
                aria-label={`Remove ${activity.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Travel info to next activity */}
      {travelInfo && (
        <div className="relative">
          <div className="absolute left-7 w-px h-8 bg-gray-300"></div>
          <div className="ml-14 my-2 flex items-center gap-2 text-xs text-gray-500">
            <Timer className="w-3 h-3 flex-shrink-0" />
            <span>{travelInfo.minutes} mins</span>
            <Route className="w-3 h-3 flex-shrink-0 ml-2" />
            <span>{travelInfo.distance} mi</span>
          </div>
        </div>
      )}
    </div>
  );
}