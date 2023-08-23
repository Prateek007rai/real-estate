const SES = require('aws-sdk/clients/ses');

const S3 = require('aws-sdk/clients/s3');

const { S3Control } = require('aws-sdk');

const NodeGeocoder = require('node-geocoder');





module.exports.DATABASE = "mongodb+srv://prateekrai436:moondive@cluster0.iyvl8hh.mongodb.net/mern";




module.exports.AWS_ACCESS_KEY_ID="AKIASOFHROZSBA37X464";

module.exports.AWS_SECRET_ACCESS = "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";




module.exports.EMAIL_FROM = '"Real Estate" <prateek.rai@moondive.co>';

module.exports.REPLY_TO = "prateek.rai@moondive.co";





const awsConfig = {

   accessKeyId: this.AWS_ACCESS_KEY_ID,

   secretAccessKey: this.AWS_SECRET_ACCESS,

   region: "us-east-1",

   apiVersion: "2010-12-01"

}

module.exports.AWSSES = new SES(awsConfig)

module.exports.AWSS3 = new S3(awsConfig)






// geo coder

const GOOGLE_PLACES_KEY = "AIzaSyAeaI1gkovXnm4yY1AzN97XOmcf1db5aAo";




const options = {

   provider: 'google',

 

   apiKey: GOOGLE_PLACES_KEY, // for Mapquest, OpenCage, Google Premier

   formatter: null // 'gpx', 'string', ...

};

 




module.exports.GOOGLE_GEOCODER = NodeGeocoder(options);





//random generate Jwt

module.exports.JWT_SECRET= "YFYH142673HHKHH3266";




// our frontend URL

module.exports.CLIENT_URL= "http://localhost:3000";