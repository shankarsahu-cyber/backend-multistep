const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ success: false, error: "Not authorized" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, error: "Token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized, no token" });
  }
};

module.exports = { protect };
