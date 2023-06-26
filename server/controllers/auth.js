const config = require('../config');
const jwt = require("jsonwebtoken");
const { emailTemplate } = require('../helpers/email');
const validator = require('email-validator');
const User = require('../models/user');
const Ad = require('../models/ad');
const { hashPassword, comparePassword } = require('../helpers/auth');
const { nanoid } = require('nanoid');


// it is the reusable code logic for token and refresh token
const tokenAndUserResponse = (req, res, user) => {     
    console.log("----> good to here",user)
       //create JWT token
       const token = jwt.sign({_id: user._id}, config.JWT_SECRET , { expiresIn: "1d" })
       const refreshToken = jwt.sign({_id: user._id}, config.JWT_SECRET , { expiresIn: "7d" })
       
       return res.json({
        token,
        refreshToken,
        user
       });
}

//localhost:8000/api
module.exports.welcome = (req,res)=>{
    res.json({
       data: 'hello in node.js world, hey',
   })
}


//pre -register user to send email
module.exports.preRegister = async(req,res)=>{
    //create JWT token using email and psw, make email link clickable
   try{
     console.log(req.body);
     const {email, password} = req.body;

     //email validation
     if(!validator.validate(email)){
        return res.json({error: "A validate email is required"})
     }
     if(!password){
        return res.json({error: "A Password is required"})
     }
     if(password && password?.length < 6){
        return res.json({error: "Password is short"})
     }

    //  check if user is present or not already
    const user = await User.findOne({email});
     if(user){
        return res.json({error: "User's email is already present"})
     }

     const token = jwt.sign({email,password}, config.JWT_SECRET, { expiresIn: "1d" })

     config.AWSSES.sendEmail( emailTemplate(email, `
                <p>Please click the below link to activate your account.</p>
                <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
     `, config.REPLY_TO, 'Activate your account')
        ,(err,data)=>{
        if(err){
            console.log("Error in sending email",err);
            return res.json({ok:false})
         }else{
            console.log("data",data);
            return res.json({ok:true})
         }
     })
   }catch(err){
    console.log(err);
    return res.json({error: "Something went wrong, try again"})
   }
}


// register after email gets verified and save user detail in DB
module.exports.register = async(req, res) => {
    try{
        console.log(req.body);
        // const decoded = jwt.verify(req.body.token, config.JWT_SECRET);                           //this decode is { email, password} , credentials details
        // console.log(decoded);
        const {email,password} = jwt.verify(req.body.token, config.JWT_SECRET);

        const hashedPassword = await hashPassword(password);
        console.log("--------",hashedPassword)
        const user = await new User({
            username: nanoid(6),                                                        //6 means it will create 6 digit id
            email,
            password: hashedPassword,

        })
        user.save();
        tokenAndUserResponse(req, res, user);
    }catch(err){
    console.log(err);
    return res.json({error: "Something went wrong, try again"})
   }
}


//login
module.exports.login = async(req, res) => {
    try{
        console.log(req.body);
        const {email, password} = req.body;

        //find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.json({error: "Email id is not rgistered yet"});
        }

        //compare the password
        console.log(password, user.password);
        const match = await comparePassword(password, user.password);                           //here user.passsword is the hashed password saved in database
        if(!match){
            return res.json({error: "Incorrect Password !!! Try again"});
        }
        tokenAndUserResponse(req, res, user);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Something went wrong, try again"})
   }
}


//google login
module.exports.googleLogin = async(req, res) => {
    try{
        console.log(req.body);
        const {email, name , googleId} = req.body;

         //  check if user is present or not already
        const userPresent = await User.findOne({email});
        if(userPresent){
            tokenAndUserResponse(req, res, userPresent);
        }else{
        const hashedPassword = await hashPassword(googleId);
        console.log("--------",hashedPassword)
        const user = await new User({
            username: nanoid(6),                                                        //6 means it will create 6 digit id
            email,
            password: hashedPassword,

        })
        user.save();
        
        tokenAndUserResponse(req, res, user);
        }

        
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Something went wrong, try again"})
   }
}


//Forgot password
module.exports.forgotPassword = async(req, res) => {
    try{
        console.log(req.body);
        const {email} = req.body;

        //find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.json({error: "Email id is not found"});
        }
        const resetCode = nanoid();
        user.resetCode = resetCode;
        user.save();

        const token = jwt.sign({resetCode}, config.JWT_SECRET , { expiresIn: "1h" })

        config.AWSSES.sendEmail(emailTemplate(email, `
               <p>Please click link below to access your account.</p>
               <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
        `, config.REPLY_TO, 'Access Your Account'),
        (err,data)=>{
            if(err){
                console.log("Error in sending email",err);
                return res.json({ok:false})
             }else{
                console.log("data",data);
                return res.json({ok:true})
             }
         })  
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Something went wrong, try again"})
   }
}


//access-account password through link
module.exports.accessAccount = async(req, res) => {
    try{
        console.log(req.body);
        const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);                                        //here req.body.resetCode is actually the token coming from url

        console.log("--------->Good",resetCode)
        //find user by resetCode and update its resetCode to  ""
        const user = await User.findOne({resetCode});
        user.resetCode = "";
        user.save();
        console.log("--------->Good",user)

        tokenAndUserResponse(req, res, user);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Something went wrong, try again"})
   }
}


//refresh the token ,, if the token is expired then without again login or logout , user can just ask for new token uing this refresh token
module.exports.refreshToken = async(req, res) => {
    try{
        console.log('.......>>>',req.headers)
        const { _id} = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);                     //here refresh-token had been passed                                  //here req.body.resetCode is actually the token coming from url

        const user = await User.findById(_id);

        console.log("--------->in refresh-token",_id)
        tokenAndUserResponse(req, res, user);
    }catch(err){
    console.log("Error >>>",err);
    return res.status(403).json({error: "refresh token failed"})
   }
}


//current user
module.exports.currentUser = async(req, res) => {
    try{
        console.log('.......>>>',req.user)
        const user = await User.findById(req.user._id);                                              // this req.userr._id comming from requireSignIn as middleware
        res.json(user);
    }catch(err){
    console.log("Error >>>",err);
    return res.status(403).json({error: "current user detailed error"})
   }
}


//public profile view
module.exports.publicProfile = async(req, res) => {
    try{
        console.log('.......>>>',req.params)
        const user = await User.findOne({username: req.params.username});                        
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "error in viewing public profile"})
   }
}

//Update the password
module.exports.updatePassword = async(req, res) => {
    try{
        const {password} = req.body;
        if(!password){
          return  res.json({error: "Password is required !!!"})
        }
        if(password && password?.length <6){
            return  res.json({error: "Password is too short, atleast 6 char!!!"})
          }

        const user = await User.findByIdAndUpdate(req.user._id, {                             //// req.user._id coming from middleware      
            password: await hashPassword(password)
        });                                
        user.save();           
        
        res.json({ ok: "password updated"});
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "error in updating password"})
   }
}


//Update the profile
module.exports.updateProfile = async(req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true});                                         
        
        res.json(user);
    }catch(err){
    console.log("Error >>>",err);
    if(err.codeName === "DuplicateKey"){                                                    //this dupicateKey error came from bottom terminal(schema Unique section).
        return res.json({error: "Username or Email is already taken"})
    }
    return res.json({error: "error in updating profile"})
   }
}


//get all agents
module.exports.agents = async(req, res) => {
    try{
        const agents = await User.find({role: 'Seller'})
        .select('-password -role -enquiredProperties -wishlist -photo.Key -photo.key');                                         
        
        res.json(agents);
    }catch(err){
    console.log("Error >>>",err);
    if(err.codeName === "DuplicateKey"){                                                   
        return res.json({error: "Username or Email is already taken"})
    }
    return res.json({error: "error in updating profile"})
   }
}


//get single agent's total ads
module.exports.agentAdCount = async(req, res) => {
    try{
        const ads = await Ad.find({postedBy: req.params._id}).select("_id");                                    
        
        res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    if(err.codeName === "DuplicateKey"){                                                   
        return res.json({error: "Username or Email is already taken"})
    }
    return res.json({error: "error in updating profile"})
   }
}


//get single agent details
module.exports.agent = async(req, res) => {
    try{
        const user = await User.findOne({username: req.params.username})
        .select('-password -role -enquiredProperties -wishlist -photo.Key -photo.key');                                    
        
        const ads = await Ad.find({postedBy: user._id}).select("-photo.key -photo.Key -photo.Bucket");  

        res.json({user, ads});
    }catch(err){
    console.log("Error >>>",err);
    if(err.codeName === "DuplicateKey"){                                                   
        return res.json({error: "Username or Email is already taken"})
    }
    return res.json({error: "error in updating profile"})
   }
}
