var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant.js");
var Dish = require("../models/dish.js");
var middleware = require("../middleware/index");

// Display dish
router.get("/:dishId", (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            Dish.findById(req.params.dishId, (err, dish) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("dishes/show", {dish: dish, restaurant: restaurant, user: req.params.username, currentUser: req.user});
                }
            })
        }
    })
});

// Edit and update dish  
router.put("/:dishId", middleware.checkDiaryOwnership, (req, res) => {    
    Dish.findByIdAndUpdate(req.params.dishId, req.body.dish, (err, dish) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id + "/dishes/" + dish._id);
        }
    });
})

// Delete a dish
router.delete("/:dishId", middleware.checkDiaryOwnership, (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
        }
    })  
})

// Route to create a dish
router.post("/", middleware.checkDiaryOwnership, (req, res) => {
    const author = {
        id: req.user._id,
        username: req.user.username,
    }

    const newDish = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        comment: req.body.comment,
        author: author
    }

    Restaurant.findById(req.params.id, (err, rest) => {
        if (err) {
            console.log(err);
        } else {
            Dish.create(newDish, (err, dish) => {
                if (err) {
                    console.log(err);
                } else { 
                    console.log(rest);
                    rest.dishes.push(dish);
                    rest.save();
                    res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
                }
            })
        }
    })
});

module.exports = router;