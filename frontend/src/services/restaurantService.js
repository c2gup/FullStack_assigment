import apiClient from './api';

const DEFAULT_CITY_ID = import.meta.env.VITE_DEFAULT_CITY_ID || '118';

/**
 * Fetch paginated list of restaurants for a city
 * @param {Object} options
 * @param {string|number} options.cityId City ID (default 118)
 * @param {number} options.page Page number (1-based)
 * @returns {Promise<{results: Array, meta: {total_pages: number, total_count: number}}>}
 */
export const getRestaurants = async ({ cityId = DEFAULT_CITY_ID, page = 1 } = {}) => {
  const response = await apiClient.get('/m/restaurant', {
    params: {
      city_id: cityId,
      page_no: page,
    },
  });

  if (response.data && response.data.status === 'Success') {
    return response.data.data;
  }

  throw new Error(response.data?.error_message || 'Failed to fetch restaurants');
};

/**
 * Fetch a specific restaurant by ID
 * @param {string|number} restaurantId
 * @returns {Promise<any>}
 */
export const getRestaurantById = async (restaurantId) => {
  // Try querying with restaurant_id parameter
  try {
    const response = await apiClient.get('/m/restaurant', {
      params: {
        restaurant_id: restaurantId,
      },
    });

    if (response.data && response.data.status === 'Success' && response.data.data?.results) {
      const match = response.data.data.results.find(
        (r) => String(r.restaurant_id) === String(restaurantId)
      );
      if (match) return match;
      if (response.data.data.results.length > 0) return response.data.data.results[0];
    }
  } catch (err) {
    console.warn('Direct restaurant lookup failed, falling back to default', err);
  }

  // Fallback: search page 1
  const firstPage = await getRestaurants({ page: 1 });
  const found = firstPage.results.find((r) => String(r.restaurant_id) === String(restaurantId));
  if (found) return found;

  throw new Error('Restaurant not found');
};
