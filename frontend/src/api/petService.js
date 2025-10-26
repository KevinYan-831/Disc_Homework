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
 * Create a new pet
 * @param {Object} petData - Pet data object (name, species, age, weight, pet_url, pet_url2)
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
 * Delete a pet by ID
 * @param {number} id - The pet ID to delete
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
