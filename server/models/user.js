const { model, Schema, ObjectId } = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        maxLength: 256
    },
    address: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    role: {
        type: [String],
        default: ["Buyer"],
        enum: ["Buyer", "Seller", "Admin"]
    },
    photo: {},
    
    enquiredProperties: [{type: Schema.Types.ObjectId, ref: "Ad"}],

    wishlist: [{type: ObjectId, ref: "Ad"}],
    
    resetCode: {
        type: String,
        default: ""
    }

},{timestamps: true})


const User = model('User' , schema);               //User is a collection of userSchema

module.exports = User ;