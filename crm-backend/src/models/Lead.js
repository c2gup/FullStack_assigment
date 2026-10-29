const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Lead phone number is required'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 digits'],
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    courseInterest: {
      type: String,
      required: [true, 'Course interest is required'],
      trim: true,
      maxlength: [120, 'Course name cannot exceed 120 characters'],
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    city: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['NEW', 'CONTACTED', 'CONVERTED'],
        message: 'Status must be one of: NEW, CONTACTED, CONVERTED',
      },
      default: 'NEW',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for querying unclaimed leads and counselor's leads with sorting
leadSchema.index({ assignedTo: 1, createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ name: 'text', email: 'text', courseInterest: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
