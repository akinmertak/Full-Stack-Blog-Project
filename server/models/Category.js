const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, lowercase: true, unique: true } // URL dostu isim (örn: yapay-zeka)
});

module.exports = mongoose.model('Category', CategorySchema);