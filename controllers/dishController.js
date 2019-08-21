const Restaurant = require("../models/restaurant.js");
const Dish = require("../models/dish.js");
const isImageUrl = require('is-image-url');

exports.dishDetail = (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to find restaurant");
            return res.redirect("/diary/" + req.params.username);
        }
        
        Dish.findById(req.params.dishId, (err, dish) => {
            if (err) {
                req.flash("error", "Unable to find dish");
                return res.redirect("/diary/" + req.params.username + "/restaurants/" + restaurant._id);
            } 
            res.render("dish", {dish: dish, restaurant: restaurant, user: req.params.username, currentUser: req.user});
        })
    })
};

exports.dishEdit = (req, res) => {    
    let img = req.body.image;
    if (!isImageUrl(img)) {
        img = "http://www.makemoneywhilstsleeping.com/wp-content/uploads/2017/02/sad-face.jpeg";
        req.flash("error", "You entered an invalid image url, so it has been replaced.");
    }

    const updatedDish = {
        name: req.body.dish.name,
        image: img,
        price: req.body.dish.price,
        comment: req.body.dish.comment,
    }
    
    Dish.findByIdAndUpdate(req.params.dishId, updatedDish, (err, dish) => {
        if (err) {
            req.flash("error", "Unable to update dish, please try again.");
        } else {
            req.flash("success", "Successfully updated dish.");
        }
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id + "/dishes/" + dish._id);
    });
}

exports.dishDelete = (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId, (err) => {
        if (err) {
            req.flash("error", "Unable to delete dish, please try again.");
        } else {
            req.flash("success", "Successfully deleted dish.");
        }
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
    })  
}

// Route to create a dish
exports.dishCreate = (req, res) => {
    Restaurant.findById(req.params.id, (err, rest) => {
        if (err) {
            req.flash("error", "Unable to find restaurant");
            return res.redirect("/diary/" + req.params.username);
        } 

        const author = {
            id: req.user._id,
            username: req.user.username,
        }
    
        let img = req.body.image;
        if (!isImageUrl(img)) {
            img = "http://www.makemoneywhilstsleeping.com/wp-content/uploads/2017/02/sad-face.jpeg";
            req.flash("error", "You entered an invalid image url, so it has been replaced.");
        }
        const newDish = {
            name: req.body.name,
            image: img,
            price: req.body.price,
            comment: req.body.comment,
            author: author
        }

        Dish.create(newDish, (err, dish) => {
            if (err) {
                req.flash("error", "Unable to create dish.");
            } else {
                rest.dishes.push(dish);
                rest.save();
                req.flash("success", "Successfully created new dish"); 
            }
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
        })
    })
};