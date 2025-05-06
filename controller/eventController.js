const mongoose = require('mongoose');
const Event = require('../model/Event');
const user_controller = require('./userController');
const jwt = require('jsonwebtoken');
const Booking = require('../model/Booking');

const create_event = async (req, res) =>
{
    //create new event
    const token = req.headers.token;

    //validate token
    try
    {
        jwt.verify(token, process.env.secret)
    } catch (err)
    {
        return res.status(401).json({ message: "Invalid Token!" });
    }

    //get vars
    const { name = null, description = "", category = "", venue = "", date = null, time = "", seatCapacity = null, bookedSeats = 0, price = null } = req.body;

    //checked that the required info is there
    if (!name || !date || !seatCapacity || !price) return res.status(401).json({ message: "You don't have the required information!" });

    //check that booked seats is less then seat capacity
    if (bookedSeats > seatCapacity) return res.status(401).json({ message: "You can have more booked seats than available seats!" })

    //create new event
    try
    {
        const result = await Event.create({
            title: name,
            description: description,
            category: category,
            venue: venue,
            date: date,
            time: time,
            seatCapacity: seatCapacity,
            bookedSeats: bookedSeats,
            price: price
        })

        return res.status(201).json(JSON.stringify(result));
    } catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_events = async (req, res) =>
{
    const { category, date, location } = req.query;

    // const { price_sort, date_sort, cap_sort, booked_sort } = req.body;

    //construct query object
    const query = {};
    if (category) query.category = category;
    if (date) query.date = date;
    if (location) query.venue = location;

    //construct sort object

    console.log('Your query is ', query);

    try
    {
        const result = await Event.find(query);
        res.status(200).json(result);

    } catch (err)
    {
        res.status(500).json({ message: err.message });
    }
}

const get_events_json = async () =>
{
    try
    {
        const results = await Event.find();
        return results;
    } catch (err)
    {
        return;
    }
}

const get_event = async (req, res) =>
{
    const id = req.params.id;

    if (!id) return res.status(401).json({ message: "No Event ID" });

    try
    {
        const result = await Event.findById(id);
        return res.status(200).json(result);
    }
    catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_event_json = async (id) =>
{
    try
    {
        const result = await Event.findById(id);
        return result;
    }
    catch (err)
    {
        return;
    }
}

const update_seats = async (id, seats) =>
{
    try
    {
        //get event
        const event = await Event.findById(id);
        event.bookedSeats += Number(seats);
        if (event.bookedSeats > event.seatCapacity)
            return false;

        event.save();
        return true;
    } catch (err)
    {
        return false;
    }
}

const get_values = async (type) =>
{
    try
    {
        const results = await Event.distinct(type);
        return results
    }
    catch (err)
    {
        return null;
    }
}

const update_event = async (req, res) =>
{
    //make sure user is an admin
    const token = req.headers.token;
    const id = req.params.id;
    console.log(req.body);
    const { name, description, category, venue, date, time, seatCapacity, bookedSeats, price } = req.body;

    if (!id || !token || !price || !name || !date || !seatCapacity)
        return res.status(401).json({ message: 'Missing Data' });

    const user = await user_controller.get_user_from_token(token);

    if (Number(bookedSeats) > Number(seatCapacity))
        return res.status(401).json({ message: "You can't book more seats then max capacity" });

    if (user && user.role == 'admin')
    {
        try
        {
            //get event
            const event = await Event.findById(id);
            event.title = name;
            event.description = description;
            event.category = category;
            event.venue = venue;
            event.date = date;
            event.time = time;
            event.seatCapacity = seatCapacity;
            event.bookedSeats = bookedSeats;
            event.price = price;
            const result = await event.save();
            return res.status(200).json(result);
        } catch (err)
        {
            return res.status(500).json({ message: err.message });
        }

    } else
    {
        return res.status(401).json({ message: "You do not have a valid login token! Please login" });
    }

}

const remove_event = async (req, res) =>
{
    const id = req.params.id;
    const booking_controller = require('./bookingsController');
    //return if no id
    if (!id) return res.status(401).json({ message: "missing ID" });

    try
    {
        //delete event
        await Event.findByIdAndDelete(id);
        //get all bookings with event
        await Booking.deleteMany({ event: id });

        //delete event
        return res.status(200).json({ message: "Deleted" })

    } catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { create_event, get_events, get_events_json, get_event, get_event_json, update_seats, get_values, update_event, remove_event };