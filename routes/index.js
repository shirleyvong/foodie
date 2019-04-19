const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Restaurant = require("../models/restaurant")


// Display home page
router.get("/", (req, res) => {
    res.render("home");
})

// Display a users diary
router.get("/diary/:username", (req, res) => {
    let username = req.params.username.toLowerCase();
    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else if (!foundUser) {
            res.render("userNotFound");
        } else {
            Restaurant.find({"author.username": username}).populate("dishes").exec((err, restaurants) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("restaurants/diary", {
                        restaurants: restaurants, 
                        user: username, 
                        currentUser: req.user, 
                        displayName: foundUser.displayName
                    });
                }
            })
        }
    })
});

// Create new account
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username.toLowerCase(), displayName: req.body.username});
    User.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        // Successful registration
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Hey " + req.user.username + ", welcome to foodie :)");
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
router.post("/login", (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { console.log(err); } 
        // User does not exist 
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            req.flash("success", "Successfully logged in.");
            res.redirect("/diary/" + req.user.username);
        })
    })(req, res);
});
   
// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/");
});

// Search for user
router.get("/search", (req, res) => {
    res.redirect("/diary/" + req.query.username);
})

module.exports = router;