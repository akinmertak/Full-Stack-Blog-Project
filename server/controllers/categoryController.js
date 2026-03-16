const Category = require('../models/category');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Kategori oluşturulamadı" });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};