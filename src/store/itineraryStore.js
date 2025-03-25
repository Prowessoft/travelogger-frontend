import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createItineraryStore = (set, get) => ({
  itinerary: null,
  days: [],
  selectedDay: 0,

  initializeDays: (days) => set({ days }),

  setItinerary: (itinerary) => {
    set({
      itinerary,
      days: itinerary.days || [], // sync days from itinerary
    });
  },

  getItinerary: () => get().itinerary,

  addActivity: (dayIndex, activity, sectionType) =>
    set((state) => {
      const updatedDays = state.days.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              sections: {
                ...day.sections,
                [sectionType]: [...(day.sections[sectionType] || []), activity],
              },
            }
          : day
      );
      return { days: updatedDays };
    }),

  removeActivity: (dayIndex, activityId, sectionType) =>
    set((state) => {
      const updatedDays =  state.days.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              sections: {
                ...day.sections,
                [sectionType]: day.sections[sectionType].filter((_, index) => index !== activityId),
              },
            }
          : day
      );
      return {
        days: updatedDays,
        itinerary: {
          ...state.itinerary,
          days: updatedDays,
        }
      }
    }),

  reorderActivities: (dayIndex, startIndex, endIndex, type) =>
    set((state) => {
      const newDays = [...state.days];
      const [removed] = newDays[dayIndex].sections[type].splice(startIndex, 1);
      newDays[dayIndex].sections[type].splice(endIndex, 0, removed);
      return { days: newDays };
    }),

  setSelectedDay: (dayIndex) => set({ selectedDay: dayIndex }),
});

// Wrap with persist and use sessionStorage
export const useItineraryStore = create(
  persist(createItineraryStore, {
    name: 'itinerary-session',
    storage: {
      getItem: (key) => {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      },
      setItem: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => {
        sessionStorage.removeItem(key);
      },
    },
    partialize: (state) => ({
      itinerary: state.itinerary,
      days: state.days,
      selectedDay: state.selectedDay,
    }),
  })
);
