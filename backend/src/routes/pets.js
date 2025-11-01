const express = require('express');
const router = express.Router();
const { query } = require('../db/config');

// GET /api/pets - Fetch all pets from the database
router.get('/', async (req, res) => {
  try {
    console.log('📥 Fetching all pets from database...');

    const result = await query(
      'SELECT * FROM pets ORDER BY id ASC'
    );

    console.log(`✅ Found ${result.rows.length} pets`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching pets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pets',
      message: error.message
    });
  }
});

// POST /api/pets - Create a new pet
router.post('/', async (req, res) => {
  try {
    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    // Validation
    if (!name || !species) {
      return res.status(400).json({
        success: false,
        error: 'Name and species are required'
      });
    }

    console.log('📥 Creating new pet:', { name, species, age, weight });

    const result = await query(
      'INSERT INTO pets (name, species, age, weight, pet_url, pet_url2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, age || null, weight || null, pet_url || null, pet_url2 || null]
    );

    console.log('✅ Pet created:', result.rows[0]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Pet created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pet',
      message: error.message
    });
  }
});

// DELETE /api/pets/:id - Delete a pet by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`📥 Deleting pet with ID: ${id}`);

    const result = await query(
      'DELETE FROM pets WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    console.log('✅ Pet deleted:', result.rows[0]);

    res.json({
      success: true,
      message: 'Pet deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error deleting pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet',
      message: error.message
    });
  }
});

module.exports = router;
