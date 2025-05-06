//posts links with user token
export default function go_to(link, form)
{
    form.action = link;
    form.method = 'post';

    const token = document.createElement('input');
    token.type = 'hidden';
    token.name = 'token';
    token.value = sessionStorage.getItem('token');

    form.appendChild(token);
    form.submit();
}