const { model, Schema, ObjectId } = require('mongoose');

const schema = new Schema({
    photos: [{}],
    address: {
        type: String,
        maxLength: 255
    },
    price: {
        type: Number,
        maxLength: 255
    },
    bedrooms: Number,
    bathrooms: Number,
    landsize: { type: String},
    carpark: Number,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates:{
            type: [Number],
            default: [-33.86882, 151.20929]
        }
    },
    title: {
        type: String,
        maxLength: 255
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    description: {},
    postedBy: {type: Schema.Types.ObjectId, ref: "User"},
    sold: {
        type: Boolean,
        default: false
    },
    googleMap: {},
    // this type is for House/Land
    type: {      
        type: String,
        default: "Other"
    },
    action: {
        type: String,
        default: "Sell" 
    },
    views: {
        type: Number,
        default: 0
    }
    
},{timestamps: true})


const Ad = model('Ad' , schema);               //User is a collection of userSchema

module.exports = Ad ;