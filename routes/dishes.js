var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant.js");
var Dish = require("../models/dish.js");
var middleware = require("../middleware/index");

// Display dish
router.get("/:dishId", (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to find restaurant");
            return res.redirect("/diary/" + req.params.username);
        } else {
            Dish.findById(req.params.dishId, (err, dish) => {
                if (err) {
                    req.flash("error", "Unable to find dish");
                    return res.redirect("/diary/" + req.params.username + "/restaurants/" + restaurant._id);
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
            req.flash("error", "Unable to update dish.");;
        } else {
            req.flash("success", "Successfully updated dish.");
        }
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id + "/dishes/" + dish._id);
    });
})

// Delete a dish
router.delete("/:dishId", middleware.checkDiaryOwnership, (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId, (err) => {
        if (err) {
            req.flash("error", "Unable to delete dish.");
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
        } else {
            req.flash("success", "Successfully deleted dish.");
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
            req.flash("error", "Unable to find restaurant");
            return res.redirect("/diary/" + req.params.username);
        } else {
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
        }
    })
});

module.exports = router;