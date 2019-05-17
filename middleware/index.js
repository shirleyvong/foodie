const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");

var middleware = {};

// Check if user is logged in
middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    // User is not logged in
    req.flash("error", "You must login to be able to do this.");
    res.redirect("/login");
}

// Check if user can make changes to diary
middleware.checkDiaryOwnership = (req, res, next) => {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        if (req.params.username == req.user.username) {
            req.flash("success", "Changes succcessfully made.");
            next();
        } else {
            // User is not author
            req.flash("error", "You do not have permission to do this.");
            res.redirect("back");
        }
    } else {
        // User is not logged in
        req.flash("error", "You must login to be able to do this.");
        res.redirect("/login")
    }
}

// Check if user can make changes to restaurant
middleware.checkRestaurantOwnership = (req, res, next) => {
    // Check if user is logged in
     if (req.isAuthenticated()) {
        Restaurant.findById(req.params.id, (err, foundRest) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                // Check that user is the author
                if (foundRest.author.id.equals(req.user._id)) {
                    req.flash("Changes successfully made.");
                    next();
                } else {
                    // User is not author
                    req.flash("error", "You do not have permission to do this.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // User is not logged in
        req.flash("error", "You must login to be able to do this.");
        res.redirect("/login");
    }    
};

// Check if user can make changes to a dish
middleware.checkDishOwnership = (req, res, next) => {
    // Check if user is logged in
     if (req.isAuthenticated()) {
        Dish.findById(req.params.id, (err, foundDish) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                // Check that user is the author
                if (foundDish.author.id.equals(req.user._id)) {
                    req.flash("Changes successfully made.");
                    next();
                } else {
                    // User is not author
                    req.flash("error", "You do not have permission to do this.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // User is not logged in
        req.flash("error", "You must login to be able to do this.");
        res.redirect("/login");
    }    
};

middleware.usernameToLower = (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
}

module.exports = middleware;