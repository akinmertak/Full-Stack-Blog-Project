const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // role ekledik
    
    // role: role || 'user' diyerek admin bilgisini de veritabanına gönderiyoruz
    const user = await User.create({ username, email, password, role: role || 'user' });
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role, // Yanıtta rolü de görelim
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: "Kayıt başarısız", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Geçersiz email veya şifre" });
  }
};