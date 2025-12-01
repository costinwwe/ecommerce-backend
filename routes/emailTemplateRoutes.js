import express from 'express';
import { EmailTemplate } from '../models/index.js';

const router = express.Router();

// @route   GET /api/email-templates
// @desc    Get all email templates
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ type: 1, name: 1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/email-templates/:id
// @desc    Get single template
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/email-templates
// @desc    Create email template
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const template = await EmailTemplate.create(req.body);
    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/email-templates/:id
// @desc    Update email template
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      message: 'Template updated successfully',
      template
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/email-templates/:id
// @desc    Delete email template
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

