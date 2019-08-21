const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // User is not logged in
    res.status(401);
    return res.render("error", {msg: "You must login to be able to do this."});

}

exports.checkDiaryOwnership = (req, res, next) => {
    if (req.params.username == req.user.username) {
        return next();
    } 
    // User is not author
    res.status(403);
    return res.render("error", {msg: "You do not have permission to do this"});
}

exports.checkRestaurantOwnership = (req, res, next) => {
    Restaurant.findById(req.params.id, (err, foundRest) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again"});
        }
        
        if (foundRest.author.id.equals(req.user._id)) {
            return next();
        } 
        // User is not the author
        res.sendStatus(403);
        return res.render("error", {msg: "You do not have permission to do this"});
        
    }); 
};

exports.checkDishOwnership = (req, res, next) => {
    Dish.findById(req.params.id, (err, foundDish) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again"});
        }

        // Check that user is the author
        if (foundDish.author.id.equals(req.user._id)) {
            return next();
        }
        // User is not author
        res.status(403);
        return res.render("error", {msg: "You do not have permission to do this"});
    });
};

exports.usernameToLower = (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
}