import { supabase } from '../config/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers (returns headers even if not authenticated)
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    'Content-Type': 'application/json',
  };

  // Add user ID only if logged in
  if (session?.user?.id) {
    headers['x-user-id'] = session.user.id;
  }

  return headers;
};

export const fetchPets = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/pets`, { headers });

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

export const createPet = async (petData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers,
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

export const deletePet = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers,
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