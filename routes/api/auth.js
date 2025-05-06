const express = require("express");
const router = express();
const path = require("path");
const user_controller = require('../../controller/userController');
const event_controller = require('../../controller/eventController');
const fs = require('fs');

const auth_admin = async (req, res, next) =>
{
    //get token
    const token = req.headers.token;
    if (!token) return res.status(401).json({ message: "Please login" });

    const user = await user_controller.get_user_from_token(token);
    console.log(user);

    if (user && user.role === 'admin')
        next();
    else
        return res.status(400).json({ message: "invalid token! Please login" });
}

router.post('/login', async (req, res) =>
{
    //validate log in
    const user = await user_controller.validate_user(req, res);

    console.log(user);

    process.env.user = user;

})

router.post('/register', async (req, res) =>
{
    const user = await user_controller.create_user(req, res);
    console.log(user);

    process.env.user = user;


    if (user['role'] == "admin ")
    {
        const html = fs.readFileSync('../../views/admin.html', 'utf-8');
        res.sendFile(html);
    }
    else
    {
        const html = fs.readFileSync(path.join(__dirname, "..", "..", 'views', 'user.html'), 'utf-8');
        res.send(html.replaceAll('{name}', user.name));
    }
});

router.post('/events', event_controller.create_event);

router.post('/user', user_controller.get_user);

router.get('/user/:token', async (req, res) =>
{
    const token = req.params.token;
    try
    {
        const user_json = await user_controller.get_user_from_token(token);
        return res.status(200).json(user_json);
    }
    catch (err)
    {
        return res.status(500).json({ message: err.message })
    }
})

router.delete('/events/:id', auth_admin, event_controller.remove_event);

router.get('/qrCode/:code', )


module.exports = router;