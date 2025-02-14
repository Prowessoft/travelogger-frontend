import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import itineraryService from "../../services/itineraryService";
import { toast } from 'sonner';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Globe,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Loader2,
  AlertCircle,
  Edit2,
  Map,
  Camera,
  Bookmark,
  Clock,
  DollarSign,
  ArrowRight
  } from "lucide-react";

// Dummy data for demonstration
const dummyItineraries = [
  {
    id: 1,
    title: "Paris Adventure",
    location: "Paris, France",
    date: "2024-04-15",
    duration: "7 days",
    budget: "$2,500",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Tokyo Explorer",
    location: "Tokyo, Japan",
    date: "2024-05-20",
    duration: "10 days",
    budget: "$3,500",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  },
];

const dummyPosts = [
  // {
  //   id: 1,
  //   type: "experience",
  //   title: "Hidden Gems of Barcelona",
  //   location: "Barcelona, Spain",
  //   date: "2024-03-10",
  //   image:
  //     "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
  //   likes: 24,
  //   comments: 5,
  // },
  // {
  //   id: 2,
  //   type: "experience",
  //   title: "Exploring Swiss Alps",
  //   location: "Zermatt, Switzerland",
  //   date: "2024-02-28",
  //   image:
  //     "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?auto=format&fit=crop&w=1200&q=80",
  //   likes: 18,
  //   comments: 3,
  // },
];

const dummySaved = [
  {
    id: 1,
    type: "guide",
    title: "Ultimate Japan Guide",
    author: "Travel Expert",
    date: "2024-03-15",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    type: "experience",
    title: "Northern Lights Adventure",
    author: "Arctic Explorer",
    date: "2024-03-10",
    image:
      "https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfileStore();
  const [activeTab, setActiveTab] = useState("itineraries");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [userItineraryData, setUserItineraryData] = useState({});
  const [userItineraries, setUserItineraries] = useState([]);
  const [loadingItineraries, setLoadingItineraries] = useState(false);

  useEffect(() => {
const abortController = new AbortController();
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

async function fetchData() {
  if (user?.id) {
    // You can await here
    const profileData = await fetchProfile(user.id);
    // const userItinerary = await itineraryService.getUserItineraries(user.id);

    // .catch((error) => {
    //   console.error("Failed to fetch profile:", error);
    // });
    setProfileData(profileData);
    // setUserItineraryData(userItinerary);
  }
}
    fetchData()
    // return () => {
    //   // this will cancel the fetch request when the effect is unmounted
    //   abortController.abort();
    // };
  }, [isAuthenticated, user?.id, fetchProfile, navigate]);

  useEffect(() => {
    const fetchUserItineraries = async () => {
      if (!user?.id) return;
      
      setLoadingItineraries(true);
      try {
        const userItineraries = await itineraryService.getUserItineraries(user.id);
        setUserItineraryData(userItineraries);
      } catch (error) {
        console.error('Failed to fetch itineraries:', error);
        toast.error('Failed to load itineraries');
      } finally {
        setLoadingItineraries(false);
      }
    };

    if (activeTab === 'itineraries') {
      fetchUserItineraries();
    }
  }, [user?.id, activeTab]);

  const handleEditItinerary = (itineraryId) => {
    navigate(`/itinerary`, { state: { itineraryId: itineraryId } });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Failed to load profile</h3>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => fetchProfile(user.id)}
                className="mt-3 text-sm font-medium hover:text-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available.</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
    const updatedData = await updateProfile(user?.id, profileData);
    setProfileData(updatedData);

  };

  const renderTabContent = () => {
    const existingUserItinerary = userItineraryData ? userItineraryData :  dummyItineraries;
    const calculateDays = (startDate, endDate) => {
      const date1 = new Date(startDate);
      const date2 = new Date(endDate);
  
      // Calculate the difference in milliseconds
      const timeDifference = date2.getTime() - date1.getTime();
      // Convert milliseconds to days
      return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }
    switch (activeTab) {
      case 'itineraries':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingItineraries ? (
              <div className="col-span-2 text-center py-8">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading itineraries...</p>
              </div>
            ) : existingUserItinerary.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-600 mb-4">No itineraries found</p>
                <button
                  onClick={() => navigate('/plan-trip')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create New Trip
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              existingUserItinerary?.length > 0 && existingUserItinerary?.map((itinerary) => (
                <div 
                  key={itinerary.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => handleEditItinerary(itinerary.id)}
                >
                  <div className="relative h-48">
                  <img
                    src={itinerary.image || dummyItineraries[0].image}
                    alt={itinerary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      {itinerary.destinationName}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{itinerary.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()} days
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {itinerary?.budget?.total.toFixed(2) || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "posts":
        const postsData = dummyPosts.length > 0 ? dummyPosts : [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {postsData.length > 0 ? (postsData?.map((post) => (
              <div 
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {post.location}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-600 mb-4">No Posts found</p>
                <button
                  onClick={() => navigate('/plan-trip')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create New Post
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      case "saved":
        const savedData = dummyPosts.length > 0 ? dummyPosts : [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedData.length > 0? dummySaved.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>By {item.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )): (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-600 mb-4">No Saved Posts</p>
                <button
                  onClick={() => navigate('/plan-trip')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Saved posts will show up here
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={profileData?.avatarImgUrl}
                  alt={profileData?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
{isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Basic Information
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              website: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Languages
                        </label>
                        <input
                          type="text"
                          value={profileData?.languages?.join(", ")}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              languages: e.target.value
                                .split(",")
                                .map((lang) => lang.trim()),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="English, Spanish, etc."
                        />
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Social Media Links
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4" />
                            Instagram
                          </div>
                        </label>
                        <input
                          type="url"
                          value={profileData?.socialMedia?.instagram}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialMedia: {
                                ...profileData?.socialMedia,
                                instagram: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://instagram.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Facebook className="w-4 h-4" />
                            Facebook
                          </div>
                        </label>
                        <input
                          type="url"
                          value={profileData?.socialMedia?.facebook}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialMedia: {
                                ...profileData?.socialMedia,
                                facebook: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://facebook.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Twitter className="w-4 h-4" />
                            Twitter
                          </div>
                        </label>
                        <input
                          type="url"
                          value={profileData?.socialMedia?.twitter}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialMedia: {
                                ...profileData?.socialMedia,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </div>
                        </label>
                        <input
                          type="url"
                          value={profileData?.socialMedia?.linkedin}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialMedia: {
                                ...profileData?.socialMedia,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Youtube className="w-4 h-4" />
                            YouTube
                          </div>
                        </label>
                        <input
                          type="url"
                          value={profileData?.socialMedia?.youtube}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialMedia: {
                                ...profileData?.socialMedia,
                                youtube: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://youtube.com/c/username"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio || "This is dummy bio"}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
              <div className="flex items-center justify-center md:justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                      {profileData.name}
                    </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{profileData.bio || 'This is dummy bio'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </div>
                {profileData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {profileData.website}
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profileData.phone}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profileData.joinDate).toLocaleDateString()}
                </div>
              </div>

              {/* Social Media Links */}
              {profileData?.socialMedia && (
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  {profileData.socialMedia.instagram && (
                    <a
                      href={profileData.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#E4405F] transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.socialMedia.facebook && (
                    <a
                      href={profileData.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#1877F2] transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.socialMedia.twitter && (
                    <a
                      href={profileData.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.socialMedia.linkedin && (
                    <a
                      href={profileData.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#0A66C2] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.socialMedia.youtube && (
                    <a
                      href={profileData.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#FF0000] transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("itineraries")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === "itineraries"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Map className="w-4 h-4" />
            Itineraries
          </button>
          {/* <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === "posts"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Camera className="w-4 h-4" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === "saved"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button> */}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
