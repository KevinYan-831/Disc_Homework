const express = require('express');
const { getAllPets, createPet, deletePet, updatePet } = require('../controllers/petsController');
const { extractUserId } = require('../middleware/auth');

const router = express.Router();

// Apply user extraction to all routes (supports both Bearer token and x-user-id header)
router.use(extractUserId);

// GET /api/pets - Fetch user's pets (or empty array if not logged in)
router.get('/', getAllPets);

// POST /api/pets - Create pet for current user
router.post('/', createPet);

// PUT /api/pets/:id - Update a pet
router.put('/:id', updatePet);

// DELETE /api/pets/:id - Delete pet (only if owned by user)
router.delete('/:id', deletePet);

module.exports = router;
