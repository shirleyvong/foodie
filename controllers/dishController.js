const Restaurant = require("../models/restaurant.js");
const Dish = require("../models/dish.js");

exports.dishDetail = (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."})
        }
        
        if (!restaurant) {
            res.status(404);
            return res.render("error", {msg: "The restaurant you are trying to update does not exist."})
        }
        
        Dish.findById(req.params.dishId, (err, dish) => {
            if (err) {
                res.status(503);
                return res.render("error", {msg: "An unexpected error occured, please try again later."})

            }

            if (!dish) {
                res.status(404);
                return res.render("error", {msg: "The dish you are trying to update does not exist."})
            }

            res.render("dish", {dish: dish, restaurant: restaurant, user: req.params.username, currentUser: req.user});
        })
    })
};

exports.dishEdit = (req, res) => {    
    const updatedDish = {
        name: req.body.dish.name,
        image: req.body.image,
        price: req.body.dish.price,
        comment: req.body.dish.comment,
    }
    
    Dish.findByIdAndUpdate(req.params.dishId, updatedDish, (err, dish) => {
        if (err) {
            res.status(503);
            res.render("error", {msg: "An unexpected error occured, please try again later."});
        } 
        
        if (!dish) {
            res.status(404);
            res.render("error", {msg: "The dish you are trying to update does not exist."});
        } 

        req.flash("success", "Successfully updated dish");
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id + "/dishes/" + dish._id);
    });
}

exports.dishDelete = (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId, (err) => {
        if (err) {
            res.status(503);
            res.render("error", {msg: "An unexpected error occured, please try again later."});
        }

        req.flash("success", "Successfully deleted dish");
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
    })  
}

// Route to create a dish
exports.dishCreate = (req, res) => {
    Restaurant.findById(req.params.id, (err, rest) => {
        if (err) {
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later."});
        } 
    
        const newDish = {
            name: req.body.name,
            image: req.body.img,
            price: req.body.price,
            comment: req.body.comment,
            author: {
                id: req.user._id,
                username: req.user.username,
            }
        }

        Dish.create(newDish, (err, dish) => {
            if (err) {
                res.status(503);
                return res.render("error", {msg: "An unexpected error occured, please try again later."});
            }
            
            rest.dishes.push(dish);
            rest.save();
            req.flash("success", "Successfully created new dish"); 
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
        })
    })
};