import go_to from '/scripts/go_to.js';

document.getElementById('logout').onclick = () =>
{
    sessionStorage.setItem('token', '');
    window.location.href = '/';
}


//filter form
const filter_form = document.getElementById('filter');

filter_form.onsubmit = (e) =>
{
    //prevent form submition
    e.preventDefault();

    const date = document.getElementById('date');
    if (date.value == '')
        date.remove();

    go_to('/user', filter_form);
}

const admin_bookings_form = document.getElementById('admin_bookings');
admin_bookings_form.onsubmit = e =>
{
    e.preventDefault();

    go_to('/admin-bookings', admin_bookings_form);
}