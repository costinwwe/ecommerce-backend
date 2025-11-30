import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if credentials are set
    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in .env file');
      return res.status(500).json({ 
        success: false,
        message: 'Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file.' 
      });
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      res.json({
        success: true,
        message: 'Login successful',
        token: 'admin-authenticated', // Simple token for now
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'An error occurred during login' 
    });
  }
});

export default router;

