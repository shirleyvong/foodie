const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");

var middleware = {};

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // User is not logged in
    req.flash("error", "You must login to be able to do this.");
    res.redirect("back");
}

middleware.checkDiaryOwnership = (req, res, next) => {
    if (req.params.username == req.user.username) {
        return next();
    } 
    // User is not author
    req.flash("error", "You do not have permission to do this.");
    return res.redirect("back");
}

middleware.checkRestaurantOwnership = (req, res, next) => {
    Restaurant.findById(req.params.id, (err, foundRest) => {
        if (err) {
            req.flash("error", "An unexpected error occured, please try again.");
            return res.redirect("back");
        } 
        
        if (foundRest.author.id.equals(req.user._id)) {
            return next();
        } 
        // User is not the author
        req.flash("error", "You do not have permission to do this.");
        return res.redirect("back");
    }); 
};

middleware.checkDishOwnership = (req, res, next) => {
    Dish.findById(req.params.id, (err, foundDish) => {
        if (err) {
            req.flash("error", "An unexpected error occured, please try again.");
            return res.redirect("back");
        }

        // Check that user is the author
        if (foundDish.author.id.equals(req.user._id)) {
            return next();
        }
        // User is not author
        req.flash("error", "You do not have permission to do this.");
        return res.redirect("back");
    });
};

middleware.usernameToLower = (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
}

module.exports = middleware;