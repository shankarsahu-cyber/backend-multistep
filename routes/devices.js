const express = require("express");
const {
  createDeviceReport,
  getDeviceReports,
  getDeviceReportById,
  updateDeviceReport,
  deleteDeviceReport,
} = require("../controllers/deviceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public: Create report
router.post("/report", createDeviceReport);

// Protected: Admin-only routes
router.get("/reports", protect, getDeviceReports);
router.get("/reports/:id", protect, getDeviceReportById);
router.put("/reports/:id", protect, updateDeviceReport);
router.delete("/reports/:id", protect, deleteDeviceReport);

module.exports = router;
