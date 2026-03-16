const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Admin yetkisi burada belirlenecek
}, { timestamps: true });

// Şifreyi kaydetmeden önce hash'leme (Mongoose Middleware)
UserSchema.pre('save', async function() { // (next) parametresini sildik
  if (!this.isModified('password')) return; // return next() yerine sadece return
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // next() çağırmaya gerek yok, async fonksiyon bitince Mongoose devam eder
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);