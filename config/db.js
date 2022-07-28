const mongoose = require('mongoose');

mongoose
    .connect("mongodb+srv://"+ process.env.DB_USER_PASS +"@twiclone.da0be.mongodb.net/db")
    .then(() => console.log("Connect to mongodb"))
    .catch((err) => console.log("Failed to connect mongodb : \n",err))