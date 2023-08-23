const { nanoid } = require('nanoid');
const config = require('../config');
const slugify = require('slugify');
const Ad = require('../models/ad');
const User = require('../models/user');
const { emailTemplate } = require('../helpers/email');


//Image Upload
module.exports.uploadImage = async(req, res) => {
    try{
        // console.log(req.body);
        const {image} = req.body; 
        const base64Image = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64")

        const type = image.split(";")[0].split("/")[1];

        //image params
        const params = {
            Bucket: "real-estate-by-prateek",
            Key: `${nanoid()}.${type}`,
            Body: base64Image,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`
        }

        config.AWSS3.upload(params, (err, data)=> {
            if(err){
                console.log(err);
                res.sendStatus(400);
            }else{
                console.log(data);
                res.send(data);                                  //it contains location and other pics related info coming from aws
            }
        })
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Upload failed, try again"})
   }
}



//Delete image from aws S3
module.exports.deleteImage = async(req, res) => {
    try{
        // console.log(req.body);
        const {Key, Bucket} = req.body; 

        config.AWSS3.deleteObject({Key, Bucket}, (err, data)=> {
            if(err){
                console.log(err);
                res.sendStatus(400);
            }else{
                console.log(data);
                res.send(data);
            }
        })
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Upload failed, try again"})
   }
}


//store ad in mongodb ///    Create ad
module.exports.create = async(req, res) => {
    try{
        console.log(req.body);
        const { photos, price, landsize, title, address, description, type} = req.body;

        if(!photos?.length){
            return res.json({error: "Photos are required"})
        }
        if(!price){
            return res.json({error: "Price is required"})
        }
        if(landsize === ""){
            return res.json({error: "landsize is required"})
        }
        if(!address){
            return res.json({error: "Address is required"})
        }
        if(!description){
            return res.json({error: "Description is required"})
        }

        const ad = await new Ad({
          ...req.body,
          postedBy: req.user._id,          //coming from middleware passedi routes folder
          slug: slugify(`${type}-${address}-${nanoid(6)}`)
        })
        ad.save();

        //make user role >> seller
        const user = await User.findByIdAndUpdate(req.user._id, { 
            $addToSet: { role: "Seller" }}, { new: true }) ;          //this $addToSet prevent duplicacy other wise it may be { Seller or SellerSeller} , when changes multiple times

        user.password = undefined;
        user.resetCode = undefined;

        res.json({
            ad,
            user
        })
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "In ad controller, Create ad failed !!! try again"})
   }
}



//return all ads to client
module.exports.ads = async(req, res) => {
    try{
        const adsForSell = await Ad.find({action: "Sell"})
         .select("-googleMap -location -photo.ETag -photo.key -photo.Key")                  // it means except these items send all data to client
         .sort({ createdAt: -1 })                                                      //it means asscending order with repect to newly added 
         .limit(12);                                                                    // only 12 data sended at once


        const adsForRent = await Ad.find({action: "Rent"})
         .select("-googleMap -location -photo.ETag -photo.key -photo.Key")                  // it means except these items send all data to client
         .sort({ createdAt: -1 })                                                      //it means asscending order with repect to newly added 
         .limit(12); 
        
        res.json({adsForSell, adsForRent});
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in fetching all ads !!! try again"})
   }
}

//open a single land/House in a page to read
module.exports.read = async(req, res) => {
    try{
        const ad = await Ad.findOne({slug: req.params.slug}).populate('postedBy',
         "name username email phone company photo.Location");

        //related ads in database
        const related = await Ad.find({
            _id: { $ne: ad._id},                                     //this means not include ad._id, bcz it is the main ad that user is finding and we gave its info in 'ad'
            action: ad.action,
            type: ad.type
        }).limit(5).select('-photos.key -photos.Key -photos.ETag -photos.Bucket')

        console.log(ad); 

        res.json({ ad , related });
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in fetching ad detail !!! try again"})
   }
}



//add to wishlist
module.exports.addToWishlist = async(req, res) => {
    try{
        console.log("inside like wisklist - ", req.body);
        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {wishlist: req.body.adId}
        }, {new: true})
         
        const {password, resetCode, ...rest} = user._doc;                  //using console.log , I cant see the function of _doc but it exist, // can use anything i place of "rest"
        res.json(rest);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in fetching ad detail !!! try again"})
   }
}


//remove from wishlist
module.exports.removeFromWishlist = async(req, res) => {
    try{
        console.log("_____----->", req.body, req.params);
        const user = await User.findByIdAndUpdate(req.user._id, 
        {
            $pull: {wishlist: req.params.adId}
        }, {new: true})
         
        const {password, resetCode, ...rest} = user._doc;                  //using console.log , I cant see the function of _doc but it exist, // can use anything i place of "rest"
        res.json(rest);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in add to wishlist!!! try again"})
   }
}



//contact seller , buyer sends message to seller
module.exports.contactSeller = async(req, res) => {
    try{
        console.log("_____----->", req.body);
        const {name, phone, email, message, adId} = req.body;
        
        const ad = await Ad.findById(adId).populate("postedBy", "email");                        //it will add email of ad creator in "ad.postedBy {email: "user@email.com"}"
        console.log("_____----->", ad);

        const user = await User.findByIdAndUpdate(req.user._id, 
            {
                $addToSet: { enquiredProperties : adId}                                         //in user model, enquiredProperties will contains the info about ad that asked

            })

        if(!user){
            return res.json({error: "Could not find the user email"})
        }else{
            //send the email to sellers
            config.AWSSES.sendEmail(
                emailTemplate(ad.postedBy.email, `
               <p>You Have recived a new customer enquiry, he might interested in your property.</p>

                   <h4>Customer Details</h4>
                   <p>Name: ${name}</p>
                   <p>Number: ${phone}</p>
                   <p>Email: ${email}</p>
                   <p>message: ${message}</p>

               <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action}</a>
                `,
                email, 
                'New Enquiry Recived'),
                (err,data)=>{
                if(err){
                    console.log("Error in sending email",err);
                    return res.json({ok:false})
                 }else{
                    console.log("data",data);
                    return res.json({ok:true})
                }
            })  
        }    

    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in send email to seller!!! try again"})
   }
}




//display all the ads created by a user
module.exports.userAds = async(req, res) => {
    try{
        console.log("---->", req.body, req.params);
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1 ;

        const total = await Ad.find({postedBy: req.user._id});

        const ads = await Ad.find({postedBy: req.user._id})
        .populate("postedBy", "email name phone company username")
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt: -1})

        res.json({ads, total: total.length})

    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error !!! try again"})
   }
}


//Update the ad
module.exports.updateAd = async(req, res) => {
    try{
        console.log("---ad data->", req.body, req.params);
        //check if login user and user that create ths ad is same or not ?
        const {photos, price, description, type, address} = req.body;
        const ad = await Ad.findById(req.params._id);

        const owner = req.user._id == ad?.postedBy;

        if(!owner){
            return res.json({error: "You are Not authorised user!!"});
        }

        //validations
        if(!photos?.length){
            return res.json({error: "Photo is required!!"});
        }
        if(!price){
            return res.json({error: "Price is required!!"});
        }
        if(!type){
            return res.json({error: "Type {house || land} is required!!"});
        }
        if(!address){
            return res.json({error: "Address is required!!"});
        }
        
        //ad update

        await ad.updateOne({
            ...req.body,
            slug: ad?.slug
        })


        res.json({ok: true});

    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in Update ad!!! try again"})
   }
}


//get enquired Properties list
module.exports.enquiredProperties = async(req, res) => {
    try{
        console.log("---ad data->", req.body, req.params);

        const user = await User.findById(req.user._id);
        const ads = await Ad.find({_id: user.enquiredProperties}).sort({createdAt: -1})                      //array of ad

        res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in enquired ad!!! try again"})
   }
}


//gets liked list
module.exports.wishlistProperty = async(req, res) => {
    try{
        console.log("---ad data->", req.body, req.params);

        const user = await User.findById(req.user._id);
        const ads = await Ad.find({_id: user.wishlist}).sort({createdAt: -1})                       

        res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in getting liked ads!!! try again"})
   }
}




//Delete the ad
module.exports.deleteAd = async(req, res) => {
    try{
        console.log("---ad data->", req.body, req.params);

        const ad = await Ad.findById(req.params._id);
        const owner = req.user._id == ad?.postedBy;

        if(!owner){
            return res.json({error: "You are Not authorised user!!"});
        }

        //ad delete
        await Ad.findByIdAndRemove(ad._id);

        res.json({ok: true});

    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in Update ad!!! try again"})
   }
}



// ads for sell
module.exports.adsForSell = async(req, res) => {
    try{
        const ads = await Ad.find({action: "Sell"})
         .select("-googleMap -location -photo.ETag -photo.key -photo.Key")                  // it means except these items send all data to client
         .sort({ createdAt: -1 })                                                      //it means asscending order with repect to newly added 
         .limit(24);                                                                    // only 12 data sended at once

        res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in fetching all ads !!! try again"})
   }
}



//ads for rent
module.exports.adsForRent = async(req, res) => {
    try{
        const ads = await Ad.find({action: "Rent"})
         .select("-googleMap -location -photos.ETag -photos.key -photos.Key")                  // it means except these items send all data to client
         .sort({ createdAt: -1 })                                                      //it means asscending order with repect to newly added 
         .limit(24); 
        
        res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in fetching all ads !!! try again"})
   }
}


//search
module.exports.search = async(req, res) => {
    try{
       console.log("req query --->", req.query);
       const { action, address, type, priceRange } = req.query;

       const ads = await Ad.find({
        action: action === "Buy" ? "Sell" : "Rent",                                           //we did this bcz in database "Sell" is the keyword not "Buy"
        type,
        price: {
            $gte: parseInt(priceRange[0]),
            $lte: parseInt(priceRange[1])
        }
       }).limit(24).sort({createdAt: -1}).select('-photos.ETag -photos.key -photos.Key -location')

       res.json(ads);
    }catch(err){
    console.log("Error >>>",err);
    return res.json({error: "Error in searching ads !!! try again"})
   }
}