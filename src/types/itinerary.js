/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Object} [location]
 * @property {string} location.name
 * @property {[number, number]} location.coordinates
 * @property {string} [startTime]
 * @property {string} [endTime]
 * @property {('attraction'|'restaurant'|'hotel'|'transport'|'other')} type
 */

/**
 * @typedef {Object} DayPlan
 * @property {string} date
 * @property {Activity[]} activities
 */

/**
 * @typedef {Object} ItineraryState
 * @property {DayPlan[]} days
 * @property {number} selectedDay
 * @property {function(number, Activity): void} addActivity
 * @property {function(number, string): void} removeActivity
 * @property {function(number, number, number): void} reorderActivities
 * @property {function(number): void} setSelectedDay
 */

export const ItineraryType = {};