const mongoose = require("mongoose");
require("dotenv").config();

module.exports.db = function db(){
     mongoose.connect(process.env.db_url).then(() => {
        console.log("Db connected");
     }).catch(_ => console.log("Error connecting to database..."))
}