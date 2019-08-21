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
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."});            
        }
            
        req.flash("success", "Created new restaurant");
        res.redirect("/diary/" + req.user.username);
    })
}

exports.restaurantEdit = (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, restaurant) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."})
        } 
        
        if (!restaurant) {
            res.status(404);
            return res.render("error", {msg: "The restaurant you are trying to update does not exist."})
        } 

        req.flash("success", "Sucessfully updated restaurant");
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
    })
}

exports.restaurantDelete = (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."})
        } 

        req.flash("success", "Sucessfully deleted restaurant.");    
        res.redirect("/diary/" + req.user.username);
    })
}

exports.restaurantDetail = (req, res) => {
    Restaurant.findById(req.params.id).populate("dishes").exec((err, restaurant) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."})
        } 

        if (!restaurant) {
            res.status(404);
            return res.render("error", {msg: "The restaurant you are trying to update deos not exist."})
        }
        
        res.render("restaurant", {restaurant: restaurant, user: req.params.username, currentUser: req.user});
    })
};
