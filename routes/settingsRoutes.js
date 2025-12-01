import express from 'express';
import { Settings } from '../models/index.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get settings
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private/Admin
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/shipping
// @desc    Update shipping settings
// @access  Private/Admin
router.put('/shipping', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    settings.shipping = { ...settings.shipping, ...req.body };
    await settings.save();

    res.json({
      message: 'Shipping settings updated',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/tax
// @desc    Update tax settings
// @access  Private/Admin
router.put('/tax', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    settings.tax = { ...settings.tax, ...req.body };
    await settings.save();

    res.json({
      message: 'Tax settings updated',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/payment
// @desc    Update payment settings
// @access  Private/Admin
router.put('/payment', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    settings.payment = { ...settings.payment, ...req.body };
    await settings.save();

    res.json({
      message: 'Payment settings updated',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

