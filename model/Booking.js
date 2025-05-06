const mongoose = require("mongoose");

const booking_schema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId },
    event: { type: mongoose.Types.ObjectId },
    quantity: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now() },
    qrCode: { type: String }
});

module.exports = mongoose.model("Booking", booking_schema);