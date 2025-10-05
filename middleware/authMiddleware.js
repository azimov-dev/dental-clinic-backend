const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token provided' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Malformed token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // load user if needed
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      id: user.id,
      role: user.role,
      full_name: user.full_name,
      password: user.password,
      phone: user.phone
    };
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
