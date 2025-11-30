import express from 'express';
import { Cart, Product } from '../models/index.js';

const router = express.Router();

// @route   GET /api/cart/:userId
// @desc    Get user's cart
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({ user: req.params.userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/:userId/add
// @desc    Add item to cart
// @access  Private
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      cart = await Cart.create({ user: req.params.userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cart/:userId/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:userId/update/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock availability
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/:userId/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:userId/remove/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/:userId/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/:userId/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

