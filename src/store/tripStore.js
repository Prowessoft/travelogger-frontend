import { create } from 'zustand';

/**
 * @typedef {import('../types/trip').Trip} Trip
 */

/**
 * @type {import('zustand').StateCreator<{
 *   currentTrip: Trip | null,
 *   setTrip: (trip: Trip) => void,
 *   clearTrip: () => void
 * }>}
 */
const createTripStore = (set) => ({
  currentTrip: JSON.parse(sessionStorage.getItem("currentTrip")) || null,
  setTrip: (trip) => {
    sessionStorage.setItem("currentTrip", JSON.stringify(trip));
    set({ currentTrip: trip })
  },
  clearTrip: () => {
    sessionStorage.removeItem("currentTrip");
    set({ currentTrip: null })
  }
});

export const useTripStore = create(createTripStore);