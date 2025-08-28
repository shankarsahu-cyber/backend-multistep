const DeviceReport = require("../models/deviceReport")
const { validationResult } = require("express-validator")

// Create new device report
const createDeviceReport = async (req, res, next) => {
  try {
    const { device, model, issues, location, contactInfo } = req.body

    // Validate required fields
    if (!device || !model || !issues || !location || !contactInfo) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: device, model, issues, location, contactInfo",
      })
    }

    // Validate contactInfo required fields
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      return res.status(400).json({
        success: false,
        error: "Missing required contact fields: name, email, phone",
      })
    }

    // Create new device report
    const deviceReport = new DeviceReport({
      device,
      model,
      issues,
      location,
      contactInfo,
    })

    const savedReport = await deviceReport.save()

    res.status(201).json({
      success: true,
      message: "Device report created successfully",
      data: savedReport,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      })
    }
    next(error)
  }
}

// Get all device reports with pagination and filtering
const getDeviceReports = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}
    if (req.query.device) filter.device = req.query.device
    if (req.query.location) filter.location = new RegExp(req.query.location, "i")
    if (req.query.status) filter.status = req.query.status

    const reports = await DeviceReport.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await DeviceReport.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get device report by ID
const getDeviceReportById = async (req, res, next) => {
  try {
    const report = await DeviceReport.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Device report not found",
      })
    }

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid report ID format",
      })
    }
    next(error)
  }
}

// Update device report
const updateDeviceReport = async (req, res, next) => {
  try {
    const report = await DeviceReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Device report not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Device report updated successfully",
      data: report,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      })
    }
    next(error)
  }
}

// Delete device report
const deleteDeviceReport = async (req, res, next) => {
  try {
    const report = await DeviceReport.findByIdAndDelete(req.params.id)

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Device report not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Device report deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createDeviceReport,
  getDeviceReports,
  getDeviceReportById,
  updateDeviceReport,
  deleteDeviceReport,
}
