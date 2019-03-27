var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// Display all restaurants
router.get("/", (req, res) => {
    Restaurant.find({}).populate("dishes").exec((err, restaurants) => {
        if (err) {
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: restaurants});
        }
    })
})

// Route to edit and update restaurant
router.put("/:id", (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    })
})

// Route to create a new restaurant
router.post("/", (req, res) => {
    const newRestaurant = {
        name: req.body.name
    };

    Restaurant.create(newRestaurant, (err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            console.log("created restaurant: ", restaurant);
            res.redirect("/restaurants");
        }
    })
})

// Route to delete a restaurant
router.delete("/:id", (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/restaurants");
        }
    })
})

// Show one restaurant and dishes
router.get("/:id", (req, res) => {
    Restaurant.findById(req.params.id).populate("dishes").exec((err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            res.render("restaurants/show", {restaurant: restaurant});
        }
    })
});

module.exports = router;