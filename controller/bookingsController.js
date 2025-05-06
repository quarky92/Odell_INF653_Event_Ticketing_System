const mongoose = require('mongoose');
const Booking = require('../model/Booking');
const jwt = require('jsonwebtoken');
const user_controller = require('./userController');
const event_controller = require('./eventController');
const nodemailer = require('nodemailer');
const qrCode = require('qrcode');

const crypto = require('crypto');


const create_booking = async (req, res) =>
{
    const token = req.headers.token;
    const { event_id, quantity, date } = req.body;

    console.log(token, event_id, quantity, date);

    if (!token || !event_id || !quantity) return res.status(401).json({ message: "Missing Information!" });

    try
    {
        //get user from token
        const user = await user_controller.get_user_from_token(token);
        if (!user) return res.status(401).json({ message: "Invalid token, please login" });

        //gets user email
        const email = user.email;

        //update max seats 
        const updated = await event_controller.update_seats(event_id, quantity);

        if (updated)
        {
            const booking = await Booking.create({
                user: user._id,
                event: event_id,
                quantity: quantity,
                bookingDate: date,
                qrCode: crypto.randomBytes(64).toString('hex')
            });

            //send email to user
            const transporter = nodemailer.createTransport({
                host: "smtp.mailersend.net",
                port: 587,
                auth: {
                    user: process.env.email,
                    pass: process.env.email_password,
                }
            });

            try
            {
                const qr_code_data = process.env.url + '/api/auth/qrCode/' + booking.qrCode;
                const url = await qrCode.toDataURL(qr_code_data);

                const mailOptions = {
                    from: `Benjamin Odell <${process.env.email}>`,
                    to: email,
                    subject: "Your Booking",
                    text: `Your booking QR code can be accessed at: ${qr_code_data}`,
                    html: `
            <div>
                <h2>Your Booking Confirmation</h2>
                <p>Thank you for your booking. Here's your QR code:</p>
                <img src="cid:qrcode" alt="QR Code" width="500" height="500" title="QR Code" style:"display:block">
            </div>
        `,
                    attachments: [{
                        filename: 'qrcode.png',
                        content: url.split('base64,')[1],
                        encoding: 'base64',
                        cid: 'qrcode'
                    }]
                };

                const mail = await transporter.sendMail(mailOptions);
                console.log('Email sent:', mail.messageId);
            } catch (err)
            {
                console.error('Error sending email:', err);
                // You might want to handle this error differently, maybe notify admin
            }


            return res.status(201).json(booking);
        }
        else
        {
            return res.status(401).json({ message: "You can't book more seats then available" });
        }
    } catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_bookings = async (req, res) =>
{
    try
    {
        //get the bookings
        const result = await Booking.find();
        return res.status(200).json(result);
    }
    catch (err)
    {
        //error
        return res.status(500).json({ message: err.message });
    }
}

const get_user_bookings = async (req, res) =>
{
    const id = req.params.id;

    console.log(id);

    if (!id) return res.status(401).json({ message: "No user ID!" });

    try
    {
        const results = await Booking.find({ user: id });
        return res.status(200).json(results);
    }
    catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_booking = async (req, res) =>
{
    const id = req.params.id;

    if (!id) return res.status(401).json({ message: "You do not have an ID" });

    try
    {
        //finds booking by id
        const result = await Booking.findById(id);
        return res.status(200).json(result);
    }
    catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_bookings_with_values = async (object) =>
{
    try
    {
        const result = await Booking.find(object);
        return result;
    } catch (err)
    {
        return null;
    }
}

const validate_qr_code = async (req, res) =>
{
    const code = req.params.code;

    if (!code) return res.status(401).json({ message: "You don't have a qr code!" });

    try
    {
        const result = await Booking.find({ qrCode: code });
        return res.status(200).json({ message: "Qr Code Accepted" });

    } catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { create_booking, get_booking, get_bookings, get_user_bookings, get_bookings_with_values, validate_qr_code };