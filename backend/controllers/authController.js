const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose'); // Removed
// const User = require('../models/User'); // Removed

const fs = require('fs');
const path = require('path');

const LOCAL_DB_PATH = path.join(__dirname, '../users_db.json');

// Helper to get local users
function getLocalUsers() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

// Helper to save local user
function saveLocalUser(user) {
  try {
    const users = getLocalUsers();
    users.push(user);
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Local DB Save Error:', e.message);
  }
}


// ensureDbConnected removed as DB is no longer used


/**
 * Handles user registration
 * Signature: (req, res)
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] Registration attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    let user;
    // ALWAYS USE LOCAL MODE
    const localUsers = getLocalUsers();
    if (localUsers.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    user = { _id: 'local_' + Date.now(), email, role: 'user', subscription: { plan: 'none', status: 'inactive' } };
    saveLocalUser({ email, password, role: 'user', _id: user._id });
    console.log('[AUTH] User registered in Local DB:', email);


    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('[AUTH] Registration successful for:', email);
    return res.status(201).json({ 
      success: true, 
      token, 
      user: { email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

/**
 * Handles user login
 * Signature: (req, res)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    console.log('[AUTH] Login attempt for:', normalizedEmail);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user;
    // ALWAYS USE LOCAL MODE
    const localUsers = getLocalUsers();
    const localUser = localUsers.find(u => u.email === normalizedEmail);
    if (!localUser || localUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user = localUser;


    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('[AUTH] Login successful for:', email);
    return res.json({ 
      success: true, 
      token, 
      user: { email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

/**
 * Fetches current user profile including subscription data
 * Used by Landing Page Top Status Bar & Protected Routes
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is already populated by authMiddleware (including location & subscription)
    if (!req.user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true, 
      user: req.user 
    });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
};

console.log('[AUTH] Controller initialized correctly ✔');
