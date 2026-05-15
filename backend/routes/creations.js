const express = require('express');
const router = express.Router();
const Creation = require('../models/Creation');

/**
 * @route   GET /api/creations
 * @desc    Get all saved creations (Internal Database)
 */
router.get('/', async (req, res) => {
  try {
    const creations = await Creation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: creations.length, data: creations });
  } catch (error) {
    console.error('[DATABASE ERROR] Fetch Creations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch creations' });
  }
});

/**
 * @route   POST /api/creations
 * @desc    Save a new creation manually
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, image, type, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const newCreation = await Creation.create({
      title,
      description: description || '',
      image: image || '',
      type: type || 'news',
      category: category || 'General',
      isAiGenerated: req.body.isAiGenerated || false,
      postedToFb: req.body.postedToFb || false
    });

    res.status(201).json({ success: true, data: newCreation });
  } catch (error) {
    console.error('[DATABASE ERROR] Create Creation:', error);
    res.status(500).json({ success: false, error: 'Failed to save creation' });
  }
});

/**
 * @route   DELETE /api/creations/:id
 * @desc    Delete a creation
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Creation.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Creation not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('[DATABASE ERROR] Delete Creation:', error);
    res.status(500).json({ success: false, error: 'Failed to delete creation' });
  }
});

module.exports = router;
