const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Book a property
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.availability) {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    // Check if tenant has already booked this property (pending or approved)
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      propertyId,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have an active request or booking for this property' });
    }

    const booking = new Booking({
      userId: req.user._id,
      propertyId,
      status: 'pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get bookings for a specific user
// @route   GET /api/bookings/user/:id
// @access  Private
const getBookingsByUser = async (req, res) => {
  try {
    // Check if user is requesting their own bookings or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }

    const bookings = await Booking.find({ userId: req.params.id })
      .populate('propertyId')
      .populate('userId', 'name email phone');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('propertyId')
      .populate('userId', 'name email phone');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update booking status (Approve/Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    // If booking is approved, update property availability to false
    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.propertyId, { availability: false });
    } else if (status === 'rejected' || status === 'pending') {
      // If booking is rejected or reset to pending, verify if there are any other approved bookings for this property
      const otherApproved = await Booking.findOne({
        propertyId: booking.propertyId,
        status: 'approved',
        _id: { $ne: booking._id },
      });
      // If no other approved booking, set availability back to true
      if (!otherApproved) {
        await Property.findByIdAndUpdate(booking.propertyId, { availability: true });
      }
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  updateBookingStatus,
};
