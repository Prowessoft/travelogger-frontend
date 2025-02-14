/**
 * @typedef {Object} DayItinerary
 * @property {number} day
 * @property {string} title
 * @property {string} description
 * @property {string[]} activities
 */

/**
 * @typedef {Object} Guide
 * @property {string} id
 * @property {string} title
 * @property {string} image
 * @property {string} description
 * @property {string} duration
 * @property {string} location
 * @property {string} bestTime
 * @property {string} budget
 * @property {string[]} highlights
 * @property {DayItinerary[]} itinerary
 * @property {string[]} tips
 * @property {string} [wikiUrl]
 */

export const GuideType = {};