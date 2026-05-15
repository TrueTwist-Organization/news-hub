const express = require('express');
const router = express.Router();
const { getLiveMarketRates } = require('../services/financeService');

router.get('/gold', async (req, res) => {
  try {
    const rates = await getLiveMarketRates();
    res.json({ success: true, rates });
  } catch (error) {
    console.error('⚠️ [FINANCE FALLBACK] Live Market Data Failed. Serving Mock Rates.');
    const mockRates = [
      { city: 'Mumbai', rate: '₹72,450', change: '+₹150' },
      { city: 'Delhi', rate: '₹72,600', change: '-₹50' },
      { city: 'Bangalore', rate: '₹72,400', change: '+₹100' },
      { city: 'Chennai', rate: '₹72,550', change: '+₹200' }
    ];
    res.json({ success: true, rates: mockRates, isMock: true });
  }
});

module.exports = router;
