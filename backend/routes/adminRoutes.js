const express = require('express');
const router = express.Router();
const AdminConfig = require('../models/AdminConfig');
const { executeAutomationCycle } = require('../services/automationService');
const { authMiddleware } = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/admin/config
router.get('/config', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let config = await AdminConfig.findOne();
    if (!config) {
      config = await AdminConfig.create({}); // Creates default config based on schema
    }
    res.json(config);
  } catch (error) {
    console.error('Error fetching admin config:', error);
    res.status(500).json({ error: 'Failed to fetch admin configuration' });
  }
});

// PUT /api/admin/update
router.put('/update', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updateData = req.body;
    let config = await AdminConfig.findOne();
    
    if (!config) {
      // If it doesn't exist, create it with the updated data
      config = await AdminConfig.create(updateData);
    } else {
      // Update existing config
      config = await AdminConfig.findOneAndUpdate({}, updateData, { new: true, runValidators: true });
    }
    
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    console.error('Error updating admin config:', error);
    res.status(500).json({ error: 'Failed to update admin configuration' });
  }
});

// POST /api/admin/trigger-manual
router.post('/trigger-manual', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await executeAutomationCycle();
    if (result.success) {
      res.json({ message: 'News fetching process started manually and completed successfully!' });
    } else {
      res.status(500).json({ error: `Failed: ${result.message}` });
    }
  } catch (error) {
    console.error('Error triggering manual fetch:', error);
    res.status(500).json({ error: 'Failed to trigger manual fetch' });
  }
});

module.exports = router;
