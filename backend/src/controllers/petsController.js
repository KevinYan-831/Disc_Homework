const { db, pets } = require('../config/database');
const { eq } = require('drizzle-orm');

/**
 * Get all pets for the current user
 */
const getAllPets = async (req, res) => {
  try {
    // If no user is logged in, return empty array
    if (!req.userId) {
      return res.json({
        success: true,
        data: [],
        count: 0
      });
    }

    const allPets = await db
      .select()
      .from(pets)
      .where(eq(pets.userId, req.userId))
      .orderBy(pets.id);

    res.json({
      success: true,
      data: allPets,
      count: allPets.length
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pets',
      details: error.message
    });
  }
};

/**
 * Create a new pet for the current user
 */
const createPet = async (req, res) => {
  try {
    // Require authentication for creating pets
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Please log in to create pets'
      });
    }

    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    if (!name || !species) {
      return res.status(400).json({
        success: false,
        error: 'Name and species are required fields'
      });
    }

    const newPet = await db.insert(pets).values({
      userId: req.userId,
      name,
      species,
      age: age || null,
      weight: weight || null,
      petUrl: pet_url || null,
      petUrl2: pet_url2 || null,
    }).returning();

    res.status(201).json({
      success: true,
      data: newPet[0],
      message: 'Pet created successfully'
    });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pet',
      details: error.message
    });
  }
};

/**
 * Delete a pet (only if owned by current user)
 */
const deletePet = async (req, res) => {
  try {
    // Require authentication for deleting pets
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Please log in to delete pets'
      });
    }

    const petId = parseInt(req.params.id);

    if (isNaN(petId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID'
      });
    }

    // First check if pet exists and belongs to user
    const existingPet = await db
      .select()
      .from(pets)
      .where(eq(pets.id, petId))
      .limit(1);

    if (existingPet.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (existingPet[0].userId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this pet'
      });
    }

    // Delete the pet
    await db.delete(pets).where(eq(pets.id, petId));

    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet',
      details: error.message
    });
  }
};

/**
 * Update a pet (only if owned by current user)
 */
const updatePet = async (req, res) => {
  try {
    // Require authentication
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Please log in to update pets'
      });
    }

    const petId = parseInt(req.params.id);

    if (isNaN(petId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID'
      });
    }

    // Check if pet exists and belongs to user
    const existingPet = await db
      .select()
      .from(pets)
      .where(eq(pets.id, petId))
      .limit(1);

    if (existingPet.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    if (existingPet[0].userId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this pet'
      });
    }

    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (species !== undefined) updateData.species = species;
    if (age !== undefined) updateData.age = age;
    if (weight !== undefined) updateData.weight = weight;
    if (pet_url !== undefined) updateData.petUrl = pet_url;
    if (pet_url2 !== undefined) updateData.petUrl2 = pet_url2;

    const updatedPet = await db
      .update(pets)
      .set(updateData)
      .where(eq(pets.id, petId))
      .returning();

    res.json({
      success: true,
      data: updatedPet[0],
      message: 'Pet updated successfully'
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pet',
      details: error.message
    });
  }
};

module.exports = {
  getAllPets,
  createPet,
  deletePet,
  updatePet
};
