const mongoose = require("mongoose")

const contactInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\d\s\-+$$$$]+$/, "Please enter a valid phone number"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      default: "",
    },
    method: {
      type: String,
      enum: ["email", "phone", "both"],
      default: "email",
    },
  },
  { _id: false },
)

const deviceReportSchema = new mongoose.Schema(
  {
    device: {
      type: String,
      required: [true, "Device type is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["computer", "laptop", "phone", "tablet", "printer", "monitor", "other"],
        message: "Device must be one of: computer, laptop, phone, tablet, printer, monitor, other",
      },
    },
    model: {
      type: String,
      required: [true, "Device model is required"],
      trim: true,
      minlength: [2, "Model must be at least 2 characters long"],
      maxlength: [50, "Model cannot exceed 50 characters"],
    },
    issues: {
      type: [String],
      required: [true, "At least one issue must be reported"],
      validate: {
        validator: (issues) => issues && issues.length > 0,
        message: "At least one issue must be specified",
      },
      enum: {
        values: [
          "screen",
          "does-not-turn-on",
          "battery",
          "keyboard",
          "mouse",
          "wifi",
          "bluetooth",
          "audio",
          "camera",
          "charging",
          "overheating",
          "slow-performance",
          "software-crash",
          "hardware-damage",
          "other",
        ],
        message: "Invalid issue type specified",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters long"],
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    contactInfo: {
      type: contactInfoSchema,
      required: [true, "Contact information is required"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
deviceReportSchema.index({ device: 1, location: 1 })
deviceReportSchema.index({ status: 1 })
deviceReportSchema.index({ createdAt: -1 })

// Virtual for report age
deviceReportSchema.virtual("reportAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)) // days
})

module.exports = mongoose.model("DeviceReport", deviceReportSchema)
