const mongoose = require("mongoose");

const connect_DB = async () =>
{
    try
    {
        mongoose.connect(process.env.uri, {});
    }
    catch (err)
    {
        console.error("Connection Error: ", err);
    }
}

module.exports = connect_DB;