const cost = document.getElementById('cost');
const price = document.getElementById('price').value;
const amt = document.getElementById('amt');

cost.textContent = '$' + amt.value * price;

amt.onchange = (e) =>
{
    cost.textContent = '$' + amt.value * price;
}

const form = document.getElementById('form');

form.onsubmit = async (e) =>
{
    e.preventDefault();
    //get token
    const token = sessionStorage.getItem('token');
    //api call to create booking
    const result = await fetch('/api/bookings', {
        method: 'post',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })

    const json = await result.json();

    console.log(json);

    if (result.status == 201)
    {
        window.location.href = `/booking/${json._id}`;
    }
    else
    {
        alert(json.message)
        //reload page
        window.location.href = window.location.href;
    }
}

