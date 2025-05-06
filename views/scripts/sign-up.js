/** @type {HTMLFormElement} */
const new_event_form = document.getElementById('sign-up');

new_event_form.onsubmit = async (e) =>
{
    e.preventDefault();

    const json = await JSON.stringify(Object.fromEntries(new FormData(new_event_form)));

    //submit form
    const response = await fetch('/api/auth/register', {
        method: "post", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: json
    })

    if (response['status'] != 201)
    {
        const j = await response.json();
        alert(j.message);
    }
    else
    {
        //login was accepted
        window.location.href = '/sign-up';
    }
}