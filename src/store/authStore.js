import { create } from 'zustand';
import authService from '../services/authService';

const createAuthStore = (set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  error: null,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password);
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  signUp: async (email, password, name, avatarUrl) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signUp(email, password, name, avatarUrl);
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  signOut: () => {
    authService.signOut();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      loading: false
    });
  },

  clearError: () => set({ error: null })
});

export const useAuthStore = create(createAuthStore);