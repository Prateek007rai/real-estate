const express = require("express");
const auth = require("../controllers/auth");
const { requireSignin } = require("../middlewares/auth");
const router = express.Router();


router.get("/", requireSignin ,auth.welcome);

//first time registering
router.post("/pre-register",auth.preRegister);
router.post("/register",auth.register);

//login
router.post("/login",auth.login);

//google-login
router.post("/google-login",auth.googleLogin);

//for password forgotten
router.post("/forgot-password",auth.forgotPassword);
router.post("/access-account",auth.accessAccount);

//update password by login user
router.put("/update-password", requireSignin, auth.updatePassword);

// to refresh the token
router.get("/refresh-token",auth.refreshToken);

//user self-info using token 
router.get("/current-user", requireSignin, auth.currentUser);

//other users profile search using username
router.get("/profile/:username", auth.publicProfile);

//update Profile
router.put("/update-profile", requireSignin, auth.updateProfile);

//all agents
router.get('/agents', auth.agents);
router.get('/agent-ad-count/:_id', auth.agentAdCount);                      // toatl ad by an agent
router.get('/agent/:username', auth.agent);                          //single agent view

module.exports = router;