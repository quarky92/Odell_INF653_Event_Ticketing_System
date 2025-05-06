import go_to from '/scripts/go_to.js';
const new_event_form = document.getElementById('form');

if (new_event_form)
    new_event_form.onsubmit = async (e) =>
    {
        e.preventDefault();

        const data = new FormData(new_event_form);

        const json = JSON.stringify(Object.fromEntries(data));

        console.log(json);

        const response = await fetch('/api/auth/login', {
            method: "post", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: json
        })

        console.log(response);
        const j = await response.json();
        console.log(j);

        if (response.status != 200)
        {
            alert(j.message);
        }
        else
        {
            sessionStorage.setItem('token', j);
            user_page();
        }
    }

function user_page()
{
    const token_form = document.createElement('form');

    document.body.appendChild(token_form);

    go_to('user', form);
}

document.getElementById('home').onclick = user_page;