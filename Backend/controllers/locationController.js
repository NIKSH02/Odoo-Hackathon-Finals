import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Initialize Mapbox client
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

// Search locations using Mapbox Geocoding API
export const searchLocations = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }

  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: query,
        limit: 5,
        types: ['place', 'locality', 'neighborhood', 'address']
      })
      .send();

    const suggestions = response.body.features.map(feature => {
      const location = {
        id: feature.id,
        place_name: feature.place_name,
        center: feature.center, // [longitude, latitude]
        geometry: feature.geometry,
        properties: feature.properties,
        context: feature.context || []
      };

      // Extract city, state, country from context
      let city = '';
      let state = '';
      let country = '';

      // Try to get from place_name first
      if (feature.place_name) {
        const parts = feature.place_name.split(', ');
        if (parts.length >= 1) city = parts[0];
        if (parts.length >= 2) state = parts[parts.length - 2];
        if (parts.length >= 1) country = parts[parts.length - 1];
      }

      // Override with context data if available
      feature.context?.forEach(ctx => {
        if (ctx.id.startsWith('place')) {
          city = ctx.text;
        } else if (ctx.id.startsWith('region')) {
          state = ctx.text;
        } else if (ctx.id.startsWith('country')) {
          country = ctx.text;
        }
      });

      // Console log as requested
      console.log(`Location found - City: ${city}, State: ${state}, Country: ${country}`);

      return {
        ...location,
        parsed: {
          city,
          state,
          country
        }
      };
    });

    res.status(200).json(
      new ApiResponse(200, suggestions, 'Locations found successfully')
    );
  } catch (error) {
    console.error('Mapbox API Error:', error);
    throw new ApiError(500, 'Failed to fetch location suggestions');
  }
});

// Reverse geocoding - get location details from coordinates
export const reverseGeocode = asyncHandler(async (req, res) => {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    throw new ApiError(400, 'Longitude and latitude are required');
  }

  try {
    const response = await geocodingClient
      .reverseGeocode({
        query: [parseFloat(longitude), parseFloat(latitude)],
        limit: 1
      })
      .send();

    if (response.body.features.length === 0) {
      throw new ApiError(404, 'No location found for these coordinates');
    }

    const feature = response.body.features[0];
    
    // Extract city, state, country
    let city = '';
    let state = '';
    let country = '';

    if (feature.place_name) {
      const parts = feature.place_name.split(', ');
      if (parts.length >= 1) city = parts[0];
      if (parts.length >= 2) state = parts[parts.length - 2];
      if (parts.length >= 1) country = parts[parts.length - 1];
    }

    feature.context?.forEach(ctx => {
      if (ctx.id.startsWith('place')) {
        city = ctx.text;
      } else if (ctx.id.startsWith('region')) {
        state = ctx.text;
      } else if (ctx.id.startsWith('country')) {
        country = ctx.text;
      }
    });

    console.log(`Reverse geocoded - City: ${city}, State: ${state}, Country: ${country}`);

    const locationData = {
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
      geometry: feature.geometry,
      properties: feature.properties,
      context: feature.context || [],
      parsed: {
        city,
        state,
        country
      }
    };

    res.status(200).json(
      new ApiResponse(200, locationData, 'Location found successfully')
    );
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    throw new ApiError(500, 'Failed to reverse geocode coordinates');
  }
});
