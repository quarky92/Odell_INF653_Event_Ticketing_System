const express = require("express");
const router = express();
const path = require("path");
const user_controller = require('../controller/userController');
const event_controller = require('../controller/eventController');
const booking_controller = require('../controller/bookingsController');

const auth_admin = async (req, res, next) =>
{
    //get token
    const body = req.body
    if (!body) return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));

    const user = await user_controller.get_user_from_token(body.token);

    if (user && user.role === 'admin')
        next();
    else
        return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
}

router.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
})

//events page
router.get('/events', async (req, res) =>
{
    try
    {
        const id = req.query.id;
        const event = await fetch(`${process.env.url}/api/events/${id}`);
        console.log(event);
        const json = await event.json();

        res.render(path.join(__dirname, '..', 'views', 'event.ejs'), { event: json });
    }
    catch (err)
    {
        res.render(path.join(__dirname, '..', 'views', 'error.ejs'), { error: err.message });
    }
})

router.get("/sign-up", (req, res) =>
{
    res.sendFile(path.join(__dirname, "..", "views", "sign_up_complete.html"));
})

router.post("/user", async (req, res) =>
{
    const body = req.body;
    if (!body) return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));

    //route to user or admin page
    req.headers.token = body.token;
    const user = await user_controller.get_user_from_token(body.token);

    if (!user) return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));

    const filters = {};

    const filter_types = ['location', 'date', 'category'];

    for (const s of filter_types)
    {
        if (body[s])
            filters[s] = body[s];
    }
    const params = new URLSearchParams(filters).toString();
    console.log(params);
    const events_api = await fetch(process.env.url + `/api/events?${params}`);
    const events = await events_api.json();

    //get event categories
    const categories = await event_controller.get_values('category');
    const locations = await event_controller.get_values('venue');

    //get bookings
    const bookings_api = await fetch(process.env.url + '/api/bookings/' + user._id);
    //create bookings object
    const bookings = {};
    if (bookings_api.status == 200)
    {
        //you have bookings
        const bookings_json = await bookings_api.json();

        for (const b of bookings_json)
        {
            //  console.log(b);
            const booking = {};
            booking.booking = b;

            //get event from booking
            const booking_api = await fetch(process.env.url + '/api/events/' + b.event);


            if (booking_api.status == 200)
                booking.event = await booking_api.json();

            bookings[b._id] = booking;
        }
    }

    res.render(path.join(__dirname, "..", "views", "user.ejs"), { user: user, events: events, bookings: Object.values(bookings), categories: categories, locations: locations });
})

router.get('/booking/:id', async (req, res) =>
{
    const id = req.params.id;
    const booking_api = await fetch(process.env.url + '/api/booking/' + id);


    if (booking_api.status == 200)
    {
        //found the bookings
        //need to get event and user
        const booking_json = await booking_api.json();
        console.log(booking_api);
        const event_id = booking_json.event;
        const user_id = booking_json.user;

        //get user
        const user_json = await user_controller.get_user(user_id);
        const event_api = await fetch(process.env.url + '/api/events/' + event_id);

        if (event_api.status == 200)
        {
            //found both a user and event
            const event_json = await event_api.json();


            return res.render(path.join(__dirname, '..', 'views', 'booking.ejs'),
                { user: user_json, event: event_json, booking: booking_json, url: process.env.url });
        }
        else
            return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    }
    else
    {
        return res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    }
})

router.post("/sign-up", (req, res) =>
{
    res.sendFile(path.join(__dirname, "..", "views", "sign-up.html"));
})

router.get("/new_event", async (req, res) =>
{
    //get events
    const events = await event_controller.get_events_json();

    if (!events)
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'));

    res.render(path.join(__dirname, "..", "views", "new_event.ejs"), { events: events });
})

//admin booking page
router.post('/admin-bookings', auth_admin, async (req, res) =>
{
    try
    {
        const body = req.body;

        let type = 'event';

        if (body.users)
            type = 'user';

        const by_type = {};
        if (type === 'event')
        {
            //get all events
            const events_api = await fetch(process.env.url + '/api/events');

            const events = await events_api.json();
            for (const event of events)
            {
                const e = {};
                e.name = event.title;
                //get bookings
                const bookings = await booking_controller.get_bookings_with_values({ event: event._id });
                e.bookings = {};

                for (const booking of bookings)
                {
                    const b = {};
                    //get user
                    const user = await user_controller.get_user(booking.user);
                    b.booking = booking;
                    b.user = user;
                    b.event = event;
                    e.bookings[booking._id] = b;
                }


                //only add events with bookings
                if (bookings.length != 0)
                    by_type[event._id] = e;
            }
        }
        else
        {
            //get all users
            const users = await user_controller.get_users();
            for (const user of users)
            {
                const u = {};
                u.name = user.email;
                //get bookings
                const bookings = await booking_controller.get_bookings_with_values({ user: user._id });
                u.bookings = {};

                for (const booking of bookings)
                {
                    const b = {};
                    //get event
                    const event_api = await fetch(process.env.url + '/api/events/' + booking.event);
                    const event = await event_api.json();

                    b.booking = booking;
                    b.event = event;
                    b.user = user;

                    u.bookings[booking._id] = b;
                }
                //only add users who have booked events
                if (bookings.length != 0)
                    by_type[user._id] = u;
            }
        }
        res.render(path.join(__dirname, '..', 'views', 'admin_bookings.ejs'), { bookings: Object.values(by_type) });
    }
    catch (err)
    {
        console.log(err.message);
        //res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    }
})



router.post("/log-in", (req, res) =>
{
    res.sendFile(path.join(__dirname, "..", "views", "log-in.html"));
})

module.exports = router;