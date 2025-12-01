import express from 'express';
import { ActivityLog } from '../models/index.js';

const router = express.Router();

// @route   GET /api/activity-logs
// @desc    Get activity logs
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { 
      user, 
      action, 
      entityType, 
      entityId, 
      startDate, 
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (user) query.user = user;
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/activity-logs/user/:userId
// @desc    Get activity logs for specific user
// @access  Private/Admin
router.get('/user/:userId', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/activity-logs/entity/:type/:id
// @desc    Get activity logs for specific entity
// @access  Private/Admin
router.get('/entity/:type/:id', async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      entityType: req.params.type,
      entityId: req.params.id
    })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

