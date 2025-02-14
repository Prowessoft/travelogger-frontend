import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, MapPin, Calendar, Clock, Users, Upload, X, ThumbsUp, Home } from 'lucide-react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const POST_TYPES = {
  HITCHHIKE: 'hitchhike',
  COUCHSURF: 'couchsurf',
  EXPERIENCE: 'experience'
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postType = searchParams.get('type') || POST_TYPES.EXPERIENCE;

  const [formData, setFormData] = useState({
    title: '',
    location: null,
    description: '',
    date: '',
    time: '',
    seats: 1,
    duration: '',
    photos: [],
    preferences: ''
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (postType === POST_TYPES.EXPERIENCE && files.length > 2) {
      alert('You can only upload up to 2 photos for experiences');
      return;
    }

    const newFiles = files.slice(0, postType === POST_TYPES.EXPERIENCE ? 2 : 1);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newFiles] }));

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {postType === POST_TYPES.HITCHHIKE && 'Looking for a Ride'}
              {postType === POST_TYPES.COUCHSURF && 'Looking for a Place to Stay'}
              {postType === POST_TYPES.EXPERIENCE && 'Share Your Travel Experience'}
            </h1>
            <p className="text-gray-600">
              {postType === POST_TYPES.HITCHHIKE && 'Connect with travelers heading your way'}
              {postType === POST_TYPES.COUCHSURF && 'Find a local host for your stay'}
              {postType === POST_TYPES.EXPERIENCE && 'Share your amazing travel stories with the community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {postType === POST_TYPES.EXPERIENCE ? 'Title of Your Experience' : 'Title'}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={postType === POST_TYPES.EXPERIENCE ? 'e.g., "A Magical Week in Bali"' : 'Give your post a title'}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {postType === POST_TYPES.HITCHHIKE ? 'Destination' : 'Location'}
              </label>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                selectProps={{
                  value: formData.location,
                  onChange: (value) => setFormData(prev => ({ ...prev, location: value })),
                  placeholder: "Search for a location...",
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    })
                  }
                }}
              />
            </div>

            {/* Type-specific fields */}
            {postType === POST_TYPES.HITCHHIKE && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={formData.seats}
                        onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {postType === POST_TYPES.COUCHSURF && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration of Stay</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 3 nights"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferences/Requirements</label>
                  <textarea
                    value={formData.preferences}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any specific preferences or requirements for your stay..."
                  />
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {postType === POST_TYPES.EXPERIENCE ? 'Tell Your Story' : 'Description'}
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  maxLength={postType === POST_TYPES.EXPERIENCE ? 1000 : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={
                    postType === POST_TYPES.EXPERIENCE 
                      ? "Share your travel experience (max 1000 words)..."
                      : "Provide more details about your request..."
                  }
                  required
                />
                {postType === POST_TYPES.EXPERIENCE && (
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {formData.description.length}/1000
                  </div>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {postType === POST_TYPES.EXPERIENCE ? 'Photos (Max 2)' : 'Photo'}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Preview Images */}
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {previewImages.length < (postType === POST_TYPES.EXPERIENCE ? 2 : 1) && (
                  <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              {postType === POST_TYPES.HITCHHIKE && (
                <>
                  <ThumbsUp className="w-5 h-5" />
                  Post Hitchhike Request
                </>
              )}
              {postType === POST_TYPES.COUCHSURF && (
                <>
                  <Home className="w-5 h-5" />
                  Post Couchsurf Request
                </>
              )}
              {postType === POST_TYPES.EXPERIENCE && (
                <>
                  <Camera className="w-5 h-5" />
                  Share Experience
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}