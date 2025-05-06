const express = require("express");
const router = express();
const path = require("path");
const user_controller = require('../../controller/userController');
const event_controller = require('../../controller/eventController');
const booking_controller = require('../../controller/bookingsController');

router.get('/events', event_controller.get_events);

router.get('/events/:id', event_controller.get_event);

//create booking
router.post('/bookings', booking_controller.create_booking);

router.get('/bookings/:id', booking_controller.get_user_bookings);

router.get('/booking/:id', booking_controller.get_booking);

router.put('/events/:id', event_controller.update_event);

module.exports = router;