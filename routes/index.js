const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Restaurant = require("../models/restaurant")
const middleware = require("../middleware/index");

// Display home page if not logged in, otherwise redirect to user's diary
router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect("/diary/" + req.user.username);
    }
    res.render("home");
})

// Display a users diary
router.get("/diary/:username", (req, res) => {
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

// Create new account
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username, displayName: req.body.username});
    User.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } 
        
        console.log("New user created. " + registeredUser);
        
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Hey " + req.user.displayName + ", welcome to foodie :)");
            res.redirect("/diary/" + req.user.username);
        });
    })
})

// Display login page
router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

// Login
router.post("/login", middleware.usernameToLower, (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { 
            req.flash("error", "An unexpected error occured, please try again.");
            return res.redirect("/login");
        }
        
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) { 
                req.flash("error", "An unexpected error occured, please try again.");
                return res.redirect("/login");
            }
            res.redirect("/diary/" + req.user.username);
        })
    })(req, res);
});
   
// Logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Search for user
router.get("/search", (req, res) => {
    let username = req.query.username.toLowerCase();
    res.redirect("/diary/" + username);
})

// Route for invalid URL path
router.use((req, res) => {
    res.render("error")
});

module.exports = router;