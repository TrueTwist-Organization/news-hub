const express   = require('express');
const router    = express.Router();
const Razorpay  = require('razorpay');
const crypto    = require('crypto');
const { authMiddleware } = require('../middleware/auth');
const User      = require('../models/User');

// ─── Razorpay instance ───────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID || 'missing_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing_key_secret',
});

// ─── Plan config ─────────────────────────────────────────────────────────────
const PLANS = {
  reader:        { amount: 9900,    label: 'Neural Reader' },      // ₹99
  pro:           { amount: 79900,   label: 'Neural Pro' },        // ₹799
  engine:        { amount: 499900,  label: 'Engine Access' },     // ₹4,999
  institutional: { amount: 4999900, label: 'Institutional Setup' } // ₹49,999
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Creates a Razorpay order for the selected plan.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const planType = (req.body?.planType || '').toLowerCase();
    
    console.log(`[PAYMENT] Creating order for Plan: ${planType} | User: ${req.user?.id}`);
    
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'missing_key_id') {
      console.error('[PAYMENT] Razorpay Key ID is missing or default.');
    }

    if (!PLANS[planType]) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan type: '${planType}'. Valid tiers: reader, pro, engine, institutional.`,
      });
    }


    const plan = PLANS[planType];

    const options = {
      amount:   plan.amount,          // amount in paise (₹ × 100)
      currency: 'INR',
      receipt:  `rcpt_${req.user.id}_${Date.now()}`,
      notes: {
        userId:   req.user.id,
        planType: planType,
        planName: plan.label,
      },
    };

    const order = await razorpay.orders.create(options);

    console.log(`[PAYMENT] Order created: ${order.id} | Plan: ${planType} | User: ${req.user.id}`);

    return res.status(200).json({
      success:    true,
      order_id:   order.id,
      amount:     order.amount,
      currency:   order.currency,
      key_id:     process.env.RAZORPAY_KEY_ID,
      planType:   planType,
      planLabel:  plan.label,
    });

  } catch (error) {
    console.error('[PAYMENT] create-order error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment order.',
      debug: error.message || error.toString() || 'Unknown error'
    });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/verify
// Verifies Razorpay signature and upgrades the user's subscription.
// Requires: { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    // ── Step 1: Verify HMAC-SHA256 signature ─────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn(`[PAYMENT] Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature.' });
    }

    // ── Step 2: Determine subscription duration ───────────────────────────────
    const now          = new Date();
    const expiryDate   = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    // ── Step 3: Update user document ─────────────────────────────────────────
    const updateData = {
      'subscription.plan':               planType,
      'subscription.status':             'active',
      'subscription.razorpay_order_id':   razorpay_order_id,
      'subscription.razorpay_payment_id': razorpay_payment_id,
      'subscription.startDate':           now,
      'subscription.expiryDate':          expiryDate,
    };

    // Special logic for Engine plan (API keys)
    if (planType === 'engine') {
      const rawKey = crypto.randomBytes(32).toString('hex');
      const apiKey = crypto.createHash('sha256').update(rawKey).digest('hex');
      updateData['apiKey.key'] = apiKey;
      updateData['apiKey.active'] = true;
      updateData['apiKey.createdAt'] = now;
    }

    // Special logic for Institutional plan
    if (planType === 'institutional') {
      updateData['subscription.manualSetupRequired'] = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, select: 'email subscription apiKey' }
    );

    console.log(`[PAYMENT] ✅ Verified & upgraded: ${updatedUser.email} → ${planType.toUpperCase()}`);

    return res.status(200).json({
      success:      true,
      message:      `Payment verified. ${planType.toUpperCase()} subscription activated.`,
      subscription: updatedUser.subscription,
      apiKey:       planType === 'engine' ? updatedUser.apiKey.key : undefined
    });


  } catch (error) {
    console.error('[PAYMENT] verify error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/status
// Returns the authenticated user's current subscription status.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    return res.status(200).json({ success: true, subscription: user.subscription });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
