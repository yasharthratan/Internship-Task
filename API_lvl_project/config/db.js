const mongoose = require('mongoose');
require("dotenv").config();

const con = mongoose.connect(process.env.MONGO_URI, {
    user: process.env.USER,
    pass: process.env.PWD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Mongo Database connect successfuly");
}).catch(err => {
    console.log(err);
});



module.exports = con;