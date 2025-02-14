import { create } from 'zustand';
import profileService from '../services/profileService';

const createProfileStore = (set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      const profile = await profileService.getProfile(userId);
      
      set({ profile, loading: false });
      return profile;

    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  updateProfile: async (userId, newProfile) => {
    set({ loading: true, error: null });
    try {
      console.log('newProfile:::', newProfile)
      const profile = await profileService.updateProfile(userId, newProfile);
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  clearProfile: () => set({ profile: null, error: null })
});

export const useProfileStore = create(createProfileStore);