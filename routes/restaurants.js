var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var User = require("../models/user")
const middleware = require("../middleware/index")

// Route to create a new restaurant
router.post("/", middleware.checkDiaryOwnership, (req, res) => {
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
            console.log(err);
        } else {
            console.log(req.user.username + "/restaurants");
            res.redirect("/diary/" + req.user.username + "/restaurants/" + restaurant._id);
        }
    })
})

// Route to edit and update restaurant
router.put("/:id", middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
        }
    })
})

// Route to delete a restaurant
router.delete("/:id", middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/diary/" + req.user.username);
        }
    })
})

// Show one restaurant and dishes
router.get("/:id", (req, res) => {
    Restaurant.findById(req.params.id).populate("dishes").exec((err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            res.render("restaurants/show", {restaurant: restaurant, user: req.params.username, currentUser: req.user});
        }
    })
});

module.exports = router;