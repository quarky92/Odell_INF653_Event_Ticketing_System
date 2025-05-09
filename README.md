all api commands links start with /api/

GET /api/events -- returns all event. You can add a category, date, or venue in the form by embedding the variables into the url, with category, date, and location (for the venue value).

GET /api/events/id -- replace id with the id number of the event you wish to get

GET /api/bookings -- returns all bookings

GET /api/bookings/ID -- returns all bookings for a user. Replace ID with user's id

GET /api/booking/ID -- returns a booking with the given ID

GET /api/auth/qrCode/_string_ -- returns a json message based of a validity of the string

POST /api/auth/register -- adds a new user to the system, and returns the user
POST /api/auth/login -- returns user token
POST /api/auth/events -- adds a new event, requires login token of an admin account
POST /api/bookings -- creates a new booking between a provided user and a provided event

PUT /api/events/ID -- updates an event (replace ID with the event ID you wish to update) requires admin token

DELETE /api/auth/event/ID -- deletes the event (replace ID with the event ID you wish to delete) requires admin token
