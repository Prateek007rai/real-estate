const express = require("express");
const PORT = process.env.PORT || 8000;
const morgan = require("morgan");
const cors = require("cors");
const db = require('./con_fig/mongoose');
const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/ad');

const app = express();

// middleware
app.use(express.json({limit: '10mb'}));                   //when data came from client, without this we can't see anything
app.use(morgan("dev"));                    //
app.use(cors());                           // allow client from diff. origins 

//router middleware
app.use('/api',authRoutes);
app.use('/api',adRoutes);


app.listen(PORT, (err)=> {
    if(err)
    return console.log("Error in running the server --->", err);

    console.log(`Server is running successfully on : ${PORT}`);
});



