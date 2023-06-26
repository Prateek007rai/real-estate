const bcrypt = require("bcrypt");

module.exports.hashPassword = (password) => {
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(12,(err, salt)=>{                                    //here, 12 is strength of hashed password , we can decrease or increase it 
             if(err){ reject(err) }

             bcrypt.hash(password , salt, (err,hash)=>{
                if(err){ reject(err) }

                resolve(hash);
             })
        })
    })
}

module.exports.comparePassword = (password, hashed) => {
    return bcrypt.compare(password,hashed);                                        // it will return either true or false on comparison
}