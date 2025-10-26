// API service for fetching pet data from the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all pets from the backend API
 * @returns {Promise<Array>} Array of pet objects
 */
export const fetchPets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch pets');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching pets from API:', error);
    throw error;
  }
};

/**
 * Fetch a single pet by ID from the backend API
 * @param {number} id - The pet ID
 * @returns {Promise<Object>} Pet object
 */
export const fetchPetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch pet');
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching pet ${id} from API:`, error);
    throw error;
  }
};

/**
 * Create a new pet (for future use)
 * @param {Object} petData - Pet data object
 * @returns {Promise<Object>} Created pet object
 */
export const createPet = async (petData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create pet');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
};

/**
 * Update a pet (for future use)
 * @param {number} id - The pet ID
 * @param {Object} petData - Updated pet data
 * @returns {Promise<Object>} Updated pet object
 */
export const updatePet = async (id, petData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update pet');
    }

    return result.data;
  } catch (error) {
    console.error(`Error updating pet ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a pet (for future use)
 * @param {number} id - The pet ID
 * @returns {Promise<Object>} Deleted pet object
 */
export const deletePet = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete pet');
    }

    return result.data;
  } catch (error) {
    console.error(`Error deleting pet ${id}:`, error);
    throw error;
  }
};
