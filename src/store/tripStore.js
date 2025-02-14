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
  currentTrip: null,
  setTrip: (trip) => set({ currentTrip: trip }),
  clearTrip: () => set({ currentTrip: null })
});

export const useTripStore = create(createTripStore);