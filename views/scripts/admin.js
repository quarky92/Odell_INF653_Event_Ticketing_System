const logout = document.getElementById('logout');

logout.onclick = () =>
{
    sessionStorage.setItem('token', '');
    window.location.href = '/';
}