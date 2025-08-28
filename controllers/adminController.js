const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ success: false, error: "Admin already exists" });
    }

    admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { registerAdmin, loginAdmin };
