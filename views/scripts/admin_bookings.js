import go_to from '/scripts/go_to.js';
// get link forms
const link_form = document.getElementById('admin_booking_link');


if (link_form)
    link_form.onsubmit = (e) =>
    {
        e.preventDefault();
        go_to('/user', link_form);
    }

//by events form
const event_form = document.getElementById('event_form');
if (event_form)
    event_form.onsubmit = e =>
    {
        e.preventDefault();
        go_to('/admin-bookings', event_form);
    }

//by users form
const user_form = document.getElementById('user_form');
if (user_form)
    user_form.onsubmit = e =>
    {
        e.preventDefault();
        go_to('admin-bookings', user_form);
    }

document.getElementById('home').onclick = e =>
{
    e.preventDefault();
    go_to('/user', document.getElementById('home_form'));
}
