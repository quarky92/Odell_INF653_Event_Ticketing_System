import qrCode from 'https://cdn.skypack.dev/qrcode';
import go_to from '/scripts/go_to.js';
const main = () =>
{
    //get canvas
    const canvas = document.getElementById('qr');

    //get string value
    const qr_string = document.getElementById('code').textContent;
    const url = document.getElementById('url').textContent;

    qrCode.toCanvas(canvas, url + '/api/auth/qrCode/' + qr_string, (err) =>
    {
        if (err)
            console.log(err);
    });

}

document.getElementById('home').onclick = e =>
{
    e.preventDefault();
    go_to('/user', document.getElementById('home_form'));
}

window.onload = main;