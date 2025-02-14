import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.error('Google Gemini AI API key is not configured');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
};

const BASE_PROMPT = `You are a travel planning assistant. Create a detailed travel itinerary in JSON format.

Trip Details:
Location: {location}
Duration: {days} days
Travelers: {travelers}
Budget: {budget}
Cuisines: {cuisines}

Return ONLY the following JSON structure with no additional text:

{
  "tripDetails": {
    "location": string,
    "duration": string,
    "travelers": number,
    "budget": string
  },
  "hotels": [
    {
      "name": string,
      "address": string,
      "pricePerNight": string,
      "rating": number,
      "description": string
    }
  ],
  "dailyItinerary": [
    {
      "day": number,
      "date": string,
      "activities": [
        {
          "name": string,
          "description": string,
          "duration": string,
          "price": string
        }
      ],
      "restaurants": [
        {
          "name": string,
          "cuisine": string,
          "address": string,
          "priceRange": string
        }
      ]
    }
  ]
}

Rules:
1. Return ONLY valid JSON
2. No markdown, no comments, no explanations
3. All strings must be properly quoted
4. No trailing commas
5. Keep descriptions concise
6. Include 3-4 hotels
7. Include 3-4 activities per day
8. Include 2-3 restaurants per day
9. Use real place names and addresses
10. Match prices to the budget level`;

const extractJSON = (text) => {
  try {
    // First try direct JSON parse
    return JSON.parse(text);
  } catch (error) {
    try {
      // Remove any markdown code blocks
      let cleanText = text.replace(/```json\s*|\s*```/g, '');
      
      // Find the first { and last }
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}') + 1;
      
      if (start === -1 || end === 0) {
        throw new Error('No JSON object found in response');
      }
      
      // Extract just the JSON portion
      cleanText = cleanText.slice(start, end);
      
      // Remove any trailing commas before closing brackets/braces
      cleanText = cleanText.replace(/,(\s*[}\]])/g, '$1');
      
      return JSON.parse(cleanText);
    } catch (innerError) {
      throw new Error(`Failed to parse response as JSON: ${innerError.message}`);
    }
  }
};

const validateStructure = (data) => {
  const required = {
    tripDetails: ['location', 'duration', 'travelers', 'budget'],
    hotels: ['name', 'address', 'pricePerNight', 'rating', 'description'],
    dailyItinerary: {
      root: ['day', 'date', 'activities', 'restaurants'],
      activities: ['name', 'description', 'duration', 'price'],
      restaurants: ['name', 'cuisine', 'address', 'priceRange']
    }
  };

  // Check trip details
  if (!data.tripDetails || typeof data.tripDetails !== 'object') {
    throw new Error('Missing or invalid tripDetails');
  }
  
  for (const field of required.tripDetails) {
    if (!data.tripDetails[field]) {
      throw new Error(`Missing required field in tripDetails: ${field}`);
    }
  }

  // Check hotels
  if (!Array.isArray(data.hotels) || data.hotels.length === 0) {
    throw new Error('Missing or invalid hotels array');
  }
  
  data.hotels.forEach((hotel, index) => {
    for (const field of required.hotels) {
      if (!hotel[field]) {
        throw new Error(`Missing required field in hotel ${index + 1}: ${field}`);
      }
    }
  });

  // Check daily itinerary
  if (!Array.isArray(data.dailyItinerary) || data.dailyItinerary.length === 0) {
    // Try to convert from object to array if needed
    if (data.dailyItinerary && typeof data.dailyItinerary === 'object') {
      data.dailyItinerary = Object.values(data.dailyItinerary);
    } else {
      throw new Error('Missing or invalid dailyItinerary');
    }
  }

  data.dailyItinerary.forEach((day, dayIndex) => {
    for (const field of required.dailyItinerary.root) {
      if (!day[field]) {
        throw new Error(`Missing required field in day ${dayIndex + 1}: ${field}`);
      }
    }

    if (!Array.isArray(day.activities)) {
      throw new Error(`Invalid activities array in day ${dayIndex + 1}`);
    }

    if (!Array.isArray(day.restaurants)) {
      throw new Error(`Invalid restaurants array in day ${dayIndex + 1}`);
    }
  });

  return data;
};

export const generateTripPlan = async (tripData) => {
  try {
    if (!apiKey) {
      throw new Error('Google Gemini AI API key is not configured. Please check your environment variables.');
    }

    const { location, startDate, endDate, travelers = 2, budget, cuisines = [] } = tripData;

    if (!location || !startDate || !endDate) {
      throw new Error('Missing required trip information (location, start date, or end date)');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Handle location from Google Places Autocomplete
    const locationString = typeof location === 'object' ? location.label : location;

    const prompt = BASE_PROMPT
      .replace('{location}', locationString)
      .replace('{days}', days)
      .replace('{travelers}', travelers)
      .replace('{budget}', budget)
      .replace('{cuisines}', cuisines.join(', ') || 'any');

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig,
    });

    if (!result?.response) {
      throw new Error('No response received from AI service. Please try again.');
    }

    const text = result.response.text();
    if (!text) {
      throw new Error('Empty response from AI service. Please try again.');
    }

    // Extract and validate JSON
    const parsedData = extractJSON(text);
    const validatedData = validateStructure(parsedData);

    return validatedData;
  } catch (error) {
    // Ensure we always throw an error with a meaningful message
    const errorMessage = error.message || 'An unexpected error occurred while generating your trip plan. Please try again.';
    console.error('Trip Generation Error:', { error: errorMessage, details: error });
    throw new Error(errorMessage);
  }
};