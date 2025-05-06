//Configures environmental variables
require("dotenv").config();

//gets express
const express = require("express");
//gets app
const app = express();

//gets mongoose
const mongoose = require("mongoose");
//gets DB connect
const connect_DB = require('./dbConfig');
//gets path
const path = require("path");

//sets our port numbers
const PORT = 3000;

//set ejs
app.set('view engine', 'ejs');

//use json
app.use(express.json());
//use url encode
app.use(express.urlencoded({ extended: false }));

//use assets
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/scripts", express.static(path.join(__dirname, "views", "/scripts")));

//sets up routing

//base routing
app.use('/', require("./routes/router"));

//user api
app.use('/api/auth', require("./routes/api/auth"));
app.use('/api', require('./routes/api/api'));

//all other routes
app.all('/*splat', (req, res) =>
{
    res.status(404);
    if (req.accepts("html"))
    {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    }
    else if (req.accepts("json"))
    {
        res.json({ message: "404 error" });
    }
    else
    {
        res.type("txt").send("404 error");
    }
})

//connects to DB
connect_DB();

//starts server
mongoose.connection.once("open", () =>
{
    app.listen(PORT, () =>
    {
        console.log("App is available on PORT: ", PORT);
    })
})