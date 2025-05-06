const mongoose = require("mongoose");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const create_user = async (req, res) =>
{
    const { name, email, pwd, role } = req.body;

    if (!name || !email || !pwd)
        return res.status(400).json({ message: "Need name, email, and password!" });

    //check if email is unique
    const duplicate = await User.findOne({ email: email }).exec();

    if (duplicate)
        return res.status(409).json({ message: "Email already in use" });

    //hash password
    const hashed_pwd = await bcrypt.hash(pwd, 10);

    try
    {
        const result = await User.create({ name: name, email: email, password: hashed_pwd, role: role });
        res.status(201);
        return result;
    } catch (err)
    {
        return res.status(500).json({ message: err.message });
    }
}

const get_users = async () =>
{
    try
    {
        const users = await User.find();
        return users;
    } catch (err)
    {
        return null;
    }
}

const validate_user = async (req, res) =>
{
    const { email, pwd } = req.body;

    const u = await User.findOne({ email: email }).exec();

    if (!u)
        return res.status(400).json({ message: "Incorrect Email or Password" });

    const match = bcrypt.compareSync(pwd, u['password']);

    if (match)
    {
        res.status(200);
        console.log(u);
        const token = jwt.sign(u.email, process.env.secret, {})
        res.json(token);
        return res;
    }
    else
        return res.status(401).json({ message: "invalid password" });
}

const get_user = async (id) =>
{

    if (!id) return null;

    try
    {
        const result = await User.findById(id);
        return result;
    } catch (err)
    {
        return null;
    }
}

const get_user_from_token = async (token) =>
{
    return jwt.verify(token, process.env.secret, async (err, email) =>
    {
        if (err) return null;

        try
        {
            const user_data = await User.findOne({ email: email }).exec();
            return user_data;
        } catch (e)
        {
            return null;
        }

    })
}

module.exports = { create_user, validate_user, get_user, get_user_from_token, get_users };