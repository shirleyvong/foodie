const express = require("express");
const router = express.Router({mergeParams: true});
const Restaurant = require("../models/restaurant");
const User = require("../models/user")
const middleware = require("../middleware/index")

// Route to create a new restaurant
router.post("/", middleware.isLoggedIn, middleware.checkDiaryOwnership, (req, res) => {
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
            req.flash("error", "Unable to create restaurant, please try again.");
        } else {
            req.flash("success", "Created new restaurant.");
        }
        res.redirect("/diary/" + req.user.username);
    })
})

// Route to edit and update restaurant
router.put("/:id", middleware.isLoggedIn, middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to edit restaurant, please try again.");
        } else {
            req.flash("success", "Sucessfully updated restaurant.");
        }
        res.redirect("/diary/" + req.user.username + "/restaurants/" + req.params.id);
    })
})

// Route to delete a restaurant
router.delete("/:id", middleware.isLoggedIn, middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            req.flash("error", "Unable to delete restaurant, please try again.");
        } else {
            req.flash("success", "Sucessfully deleted restaurant.");    
        }
        res.redirect("/diary/" + req.user.username);
    })
})

// Show one restaurant and dishes
router.get("/:id", (req, res) => {
    Restaurant.findById(req.params.id).populate("dishes").exec((err, restaurant) => {
        if (err) {
            req.flash("error", "Unable to find restaurant");
            return res.redirect("/diary/" + req.params.username);
        } 
        res.render("restaurant", {restaurant: restaurant, user: req.params.username, currentUser: req.user});
    })
});

module.exports = router;