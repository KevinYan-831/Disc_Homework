const express = require('express');
const { db, pets } = require('../db/config');
const { eq, and} = require('drizzle-orm');

const router = express.Router();

// Middleware to extract user ID (optional - allows guest access)
const extractUserId = (req, res, next) => {
  req.userId = req.headers['x-user-id'] || null;
  next();
};

// Apply user extraction to all routes
router.use(extractUserId);

// GET /api/pets - Fetch user's pets (or empty array if not logged in)
router.get('/', async (req, res) => {
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
      .where(eq(pets.userId, req.userId))  // ← Filter by user
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
});

// POST /api/pets - Create pet for current user
router.post('/', async (req, res) => {
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
      userId: req.userId,  // ← Set user_id
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
});

// DELETE /api/pets/:id - Delete pet (only if owned by user)
router.delete('/:id', async (req, res) => {
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

    // Check ownership before deleting
    const deletedPet = await db
      .delete(pets)
      .where(
        and(
          eq(pets.id, petId),
          eq(pets.userId, req.userId)  // ← Only delete if user owns it
        )
      )
      .returning();

    if (deletedPet.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Pet deleted successfully',
      data: deletedPet[0]
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet',
      details: error.message
    });
  }
});

module.exports = router;