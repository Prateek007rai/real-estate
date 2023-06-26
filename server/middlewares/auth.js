const config = require('../config');
const jwt = require('jsonwebtoken');


module.exports.requireSignin = async(req,res, next) => {
    try{
        console.log(">>>>",req.headers);
        const decoded = jwt.verify(req.headers.authorization, config.JWT_SECRET);                         //here it takes token , not the refresh-token in authorization                        //in decoded, User._id will getstored
        req.user = decoded;                                                                          //we made this req.user._id ,,,,,, using this _id we can know which user is currently logged in
        next();

    }catch(err){
    console.log("Error >>>",err);
    return res.status(401).json({error: "Invalid or Expired token"})
   }
}