import { create } from 'zustand';

const createItineraryStore = (set, get) => ({
  days: [],
  // itinerary: {
  //   id: "",
  //   userId: "",
  //   title: "",
  //   tripImg: "",
  //   status: "draft",
  //   visibility: "private",
  //   tripDetails: {
  //     destination: { name: "", coordinates: null },
  //     startDate: "",
  //     endDate: "",
  //     budget: { currency: "USD", total: 0, breakdown: {} },
  //   },
  //   days: [], // This holds the days inside itinerary
  //   sharedWith: [],
  //   metadata: { tags: null, isTemplate: false, language: "en", version: 1 },
  // },
  selectedDay: 0,
  initializeDays: (days) => set({ days }),
  addActivity: (dayIndex, activity, sectionType) =>
    set((state) => {
      const updatedDays = state.days.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              sections: {
                ...day.sections,
                [sectionType]: [...(day.sections[sectionType] || []), activity], // Append activity
              },
            }
          : day
      );

      return {
          ...state,
          days: updatedDays, // Ensure days inside itinerary are updated
      };
    }),
  setItinerary: (itinerary) => set({ itinerary }),
  getItinerary: () => get().itinerary, 
  removeActivity: (dayIndex, activityId, sectionType) =>
    set((state) => ({
      itinerary: {
        ...state.itinerary,
        days: state.itinerary.days.map((day, idx) =>
          idx === dayIndex
            ? {
                ...day,
                sections: {
                  ...day.sections,
                  [sectionType]: day.sections[sectionType].filter((a) => a.id !== activityId),
                },
              }
            : day
        ),
      },
    })),
  reorderActivities: (dayIndex, startIndex, endIndex) =>
    set((state) => {
      const newDays = [...state.days];
      const [removed] = newDays[dayIndex].activities.splice(startIndex, 1);
      newDays[dayIndex].activities.splice(endIndex, 0, removed);
      return { days: newDays };
    }),
  setSelectedDay: (dayIndex) => set({ selectedDay: dayIndex }),
});

export const useItineraryStore = create(createItineraryStore);