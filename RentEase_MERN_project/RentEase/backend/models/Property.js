const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price per month'],
    },
    images: {
      type: [String],
      default: [],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify the number of bedrooms'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
