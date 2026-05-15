const express = require('express');
const router = express.Router();
const { generateScript } = require('../services/geminiService');

router.post('/', async (req, res) => {
  console.log('[SCRIPT ROUTE] Received Payload:', req.body);

  try {
    const { title, description } = req.body;
    
    // Explicit validation before hitting Gemini
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required payload. Both title and description are required.' 
      });
    }

    const script = await generateScript(title, description);
    res.json({ success: true, script });
  } catch (error) {
    console.error('[SCRIPT ROUTE] Execution Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
