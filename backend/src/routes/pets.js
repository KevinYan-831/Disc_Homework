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

// GET /api/pets/:id - Fetch a specific pet by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Fetching pet with ID: ${id}`);

    const result = await query(
      'SELECT * FROM pets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    console.log(`✅ Found pet:`, result.rows[0]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pet',
      message: error.message
    });
  }
});

// POST /api/pets - Create a new pet (optional, for future use)
router.post('/', async (req, res) => {
  try {
    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    console.log('📥 Creating new pet:', { name, species });

    const result = await query(
      'INSERT INTO pets (name, species, age, weight, pet_url, pet_url2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, age, weight, pet_url, pet_url2]
    );

    console.log('✅ Pet created:', result.rows[0]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
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

// PUT /api/pets/:id - Update a pet (optional, for future use)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, age, weight, pet_url, pet_url2 } = req.body;

    console.log(`📥 Updating pet with ID: ${id}`);

    const result = await query(
      'UPDATE pets SET name = $1, species = $2, age = $3, weight = $4, pet_url = $5, pet_url2 = $6 WHERE id = $7 RETURNING *',
      [name, species, age, weight, pet_url, pet_url2, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    console.log('✅ Pet updated:', result.rows[0]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error updating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pet',
      message: error.message
    });
  }
});

// DELETE /api/pets/:id - Delete a pet (optional, for future use)
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
