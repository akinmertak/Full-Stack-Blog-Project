const express = require('express');
const router = express.Router();
const { 
  getBlogs, createBlog, getBlogById, updateBlog, deleteBlog, addComment, likeBlog 
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin işlemleri
router.post('/', protect, admin, createBlog);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

// Etkileşimler (Sadece giriş yapanlar)
router.post('/:id/comments', protect, addComment);
router.post('/:id/like', protect, likeBlog);

module.exports = router;