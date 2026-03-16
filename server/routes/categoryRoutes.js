const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Herkes kategorileri görebilir
router.get('/', getCategories);

// Sadece admin yeni kategori ekleyebilir
router.post('/', protect, admin, createCategory);

module.exports = router;