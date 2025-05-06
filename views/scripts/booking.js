import go_to from '/scripts/go_to.js';

document.getElementById('home').onclick = e =>
{
    e.preventDefault();
    go_to('/user', document.getElementById('home_form'));
}