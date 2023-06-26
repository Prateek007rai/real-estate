const mongoose = require("mongoose");
const { DATABASE } = require("../config");


//connect to the database
mongoose.connect(DATABASE);


// Acquire the connection (to check if it successful)
const db = mongoose.connection; 

//error
db.on('error',console.error.bind(console,'error connecting to MongodB'));

//Up and Running then print message
db.once('open',function(){
         console.log('Successfully connected to db :: MongoDB');
});

module.exports = db;
