const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings);

router.route('/user/:id')
  .get(protect, getBookingsByUser);

router.route('/:id/status')
  .put(protect, adminOnly, updateBookingStatus);

module.exports = router;
