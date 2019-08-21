const Restaurant = require("../models/restaurant");

exports.restaurantCreate = (req, res) => {
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newRestaurant = {
        name: req.body.name,
        author: author
    };

    Restaurant.create(newRestaurant, (err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to create restaurant, please try again later");
            res.setStatus(503);
        } else {
            req.flash("success", "Created new restaurant");
        }
        res.redirect("/diary/" + req.user.username);
    })
}

exports.restaurantEdit = (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to edit restaurant, please try again later");
            res.setStatus(503);
        } else if (!restaurant) {
            req.flash("error", "Restaurant to edit does not exist");
            res.setStatus(404);
        } else {
            req.flash("success", "Sucessfully updated restaurant");
        }
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
    })
}

exports.restaurantDelete = (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            req.flash("error", "Unable to delete restaurant, please try again.");
            res.setStatus(503);
        } else {
            req.flash("success", "Sucessfully deleted restaurant.");    
        }
        res.redirect("/diary/" + req.user.username);
    })
}

exports.restaurantDetail = (req, res) => {
    Restaurant.findById(req.params.id).populate("dishes").exec((err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to load restaurant, please try again later");
            res.setStatus(503);
            return res.redirect("/diary/" + req.params.username);
        } 
        if (!restaurant) {
            req.flash("error", "Restaurant does not exist");
            res.setStatus(404);
            return res.redirect("/diary/" + req.params.username);
        }
        res.render("restaurant", {restaurant: restaurant, user: req.params.username, currentUser: req.user});
    })
};
