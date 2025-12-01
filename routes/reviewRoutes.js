import express from 'express';
import { Review, Product } from '../models/index.js';

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews (with moderation status)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status, productId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (productId) query.product = productId;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/pending
// @desc    Get pending reviews
// @access  Private/Admin
router.get('/pending', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve review
// @access  Private/Admin
router.put('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'approved';
    review.moderatedAt = new Date();
    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      const allReviews = await Review.find({ 
        product: review.product, 
        status: 'approved' 
      });
      product.numReviews = allReviews.length;
      product.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await product.save();
    }

    res.json({
      message: 'Review approved',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reviews/:id/reject
// @desc    Reject review
// @access  Private/Admin
router.put('/:id/reject', async (req, res) => {
  try {
    const { moderationNote } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'rejected';
    review.moderatedAt = new Date();
    if (moderationNote) review.moderationNote = moderationNote;
    await review.save();

    res.json({
      message: 'Review rejected',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      const allReviews = await Review.find({ 
        product: review.product, 
        status: 'approved' 
      });
      product.numReviews = allReviews.length;
      product.rating = allReviews.length > 0 
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
        : 0;
      await product.save();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reviews/:id/reply
// @desc    Reply to review
// @access  Private/Admin
router.post('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.replies.push({
      reply,
      repliedBy: req.user?.id || null,
      createdAt: new Date()
    });

    await review.save();
    res.json({
      message: 'Reply added',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

