const express = require('express');
const { db, pets } = require('../db/config');
const { eq, desc } = require('drizzle-orm');

const router = express.Router();


// GET /api/pets - Fetch all pets

router.get('/', async (req, res) => {
  try {
    // Drizzle query: SELECT * FROM pets ORDER BY id ASC
    const allPets = await db.select().from(pets).orderBy(pets.id);
    
    res.json({
      success: true,
      data: allPets,
      count: allPets.length
    });
  } catch (error) {
    console.error('❌ Error fetching pets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pets',
      details: error.message
    });
  }
});

// POST /api/pets - Create a new pet

router.post('/', async (req, res) => {
  try {
    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    // Validate required fields
    if (!name || !species) {
      return res.status(400).json({
        success: false,
        error: 'Name and species are required fields'
      });
    }

    // Drizzle query: INSERT INTO pets (...) VALUES (...) RETURNING *
    const newPet = await db.insert(pets).values({
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
    console.error('❌ Error creating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pet',
      details: error.message
    });
  }
});


// DELETE /api/pets/:id - Delete a pet

router.delete('/:id', async (req, res) => {
  try {
    const petId = parseInt(req.params.id);

    if (isNaN(petId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID'
      });
    }

    // Drizzle query: DELETE FROM pets WHERE id = $1 RETURNING *
    const deletedPet = await db
      .delete(pets)
      .where(eq(pets.id, petId))
      .returning();

    if (deletedPet.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    res.json({
      success: true,
      message: 'Pet deleted successfully',
      data: deletedPet[0]
    });
  } catch (error) {
    console.error('❌ Error deleting pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet',
      details: error.message
    });
  }
});

module.exports = router;