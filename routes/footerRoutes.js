import express from 'express';
import { Footer } from '../models/index.js';

const router = express.Router();

// @route   GET /api/footer
// @desc    Get footer information
// @access  Public
router.get('/', async (req, res) => {
  try {
    const footer = await Footer.getFooter();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/footer
// @desc    Update footer information
// @access  Private/Admin
router.put('/', async (req, res) => {
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      footer = await Footer.create(req.body);
    } else {
      // Allow partial updates - merge with existing data
      const updateData = { ...footer.toObject(), ...req.body };
      footer = await Footer.findByIdAndUpdate(
        footer._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.json({
      message: 'Footer updated successfully',
      footer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/footer/contact
// @desc    Update only contact information
// @access  Private/Admin
router.put('/contact', async (req, res) => {
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      footer = await Footer.create({ contact: req.body });
    } else {
      // Update only contact information
      footer.contact = { ...footer.contact.toObject(), ...req.body };
      await footer.save();
    }

    res.json({
      message: 'Contact information updated successfully',
      footer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

