const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Restaurant = require("../models/restaurant")
const middleware = require("../middleware/index");
const loginController = require('../controllers/loginController');

router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect("/diary/" + req.user.username);
    }
    return res.render("home");
})

router.get("/diary/:username", (req, res, next) => {
    let username = req.params.username.toLowerCase();
    User.findOne({username: username}, (err, foundUser) => {
        if (err || ! foundUser) {
            return res.render("error");
        }

        Restaurant.find({"author.username": username}).populate("dishes").exec((err, restaurants) => {
            if (err) {
                return res.render("error");
            } 
            res.render("diary", {
                exists: true, 
                restaurants: restaurants, 
                user: username, 
                currentUser: req.user, 
                displayName: foundUser.displayName
            });
        })
    })
});

router.get("/search", (req, res) => {
    let username = req.query.username.toLowerCase();
    res.redirect("/diary/" + username);
})

router.post("/register", loginController.register);

router.get("/login", loginController.loginPage);

router.get("/register", loginController.registerPage);

router.post("/login", middleware.usernameToLower, loginController.login);
   
router.get("/logout", loginController.logout);

module.exports = router;