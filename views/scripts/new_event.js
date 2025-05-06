import go_to from '/scripts/go_to.js';

const new_event_form = document.getElementById('form');

new_event_form.onsubmit = async (e) =>
{
    //stop from sumbmition
    e.preventDefault();

    const json = Object.fromEntries(new FormData(new_event_form));

    //Submit the form
    const result = await fetch('/api/auth/events', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(json)
    })

    const parsed = await result.json();

    if (result.status != 201)
    {
        //error with creating event
        alert(parsed.message);
    }
    else
    {
        alert('Event Created!');
        window.location.href = window.location.href;
    }

}

const back_form = document.getElementById('back');



back_form.onsubmit = (e) =>
{
    e.preventDefault();
    go_to('/user', back_form);
}

const update_submit = async (e) =>
{
    e.preventDefault();

    /**@type {HTMLFormElement} */
    const form = e.target;
    const form_data = Object.fromEntries(new FormData(form));

    const id = form.firstElementChild.value;
    console.log(id);

    //create api call
    const update_api = await fetch(`/api/events/${id}`,
        {
            method: 'PUT',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': sessionStorage.getItem('token')
            },
            body: JSON.stringify(form_data)
        })

    if (update_api.status == 200)
    {
        //reload page
        window.location.href = window.location.href;
    }
    else
    {
        //display error
        const update_json = await update_api.json();
        alert(update_json.message);
    }
}

const update_form = document.getElementsByClassName('update')
for (const f of update_form)
{
    f.onsubmit = update_submit;
}

//the delete event
const delete_event = async (e) =>
{
    if (!confirm("Do you want to delete! This will delete all bookings related to this event!"))
        return;

    //get the form
    const form = e.target.parentElement;
    //get the selected event ID
    const id = form.firstElementChild.value;

    //delete API call
    const delete_api = await fetch(`/api/auth/events/${id}`, {
        method: 'delete',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem('token')
        }
    });

    if (delete_api.status != 200)
    {
        const message = await delete_api.json();
        alert(message.message);
    }
    else
    {
        //Reload
        window.location.href = window.location.href;
    }
}

//add event to all delete buttons
const delete_buttons = document.getElementsByClassName('delete');
for (const b of delete_buttons)
{
    b.onclick = delete_event;
}
