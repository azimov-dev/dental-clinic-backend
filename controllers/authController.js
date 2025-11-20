const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

exports.getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { password, full_name, phone, role } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: "phone and password required" });
    const existing = await User.findOne({ where: { phone } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      phone,
      password: hashed,
      full_name,
      role: role || "receptionist",
    });
    res.status(201).json({ id: user.id, phone: user.phone });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: "phone and password required" });
    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        full_name: user.full_name,
        password: user.password,
      },
    });
  } catch (err) {
    next(err);
  }
};
