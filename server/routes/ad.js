const express = require("express");
const ad = require("../controllers/ad");
const { requireSignin } = require("../middlewares/auth");
const router = express.Router();

router.post("/upload-image", requireSignin, ad.uploadImage);
router.post("/remove-image", requireSignin, ad.deleteImage);

//create new ad
router.post("/ad", requireSignin, ad.create);

//get ads
router.get("/ads",  ad.ads);
router.get("/ad/:slug",  ad.read);

//wishlist like/unlike
router.post("/wishlist", requireSignin, ad.addToWishlist);
router.delete("/wishlist/:adId", requireSignin, ad.removeFromWishlist);

//contact-seller
router.post("/contact-seller", requireSignin, ad.contactSeller);

router.get("/user-ads/:page", requireSignin, ad.userAds);

//update the ad
router.put("/ad/:_id", requireSignin, ad.updateAd);

//delete the ad
router.delete("/ad/:_id", requireSignin, ad.deleteAd);

//enuired property list
router.get("/enquired-properties", requireSignin, ad.enquiredProperties);
//liked property
router.get("/user-wishlist", requireSignin, ad.wishlistProperty);

//ads for sell and rent
router.get('/ads-for-sell', ad.adsForSell);
router.get('/ads-for-rent', ad.adsForRent);

router.get('/search', ad.search);

module.exports = router;