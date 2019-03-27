var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant.js");
var Dish = require("../models/dish.js")

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
                    res.render("dishes/show", {dish: dish, restaurant: restaurant});
                }
            })
        }
    })

});

// Edit and update dish  
router.put("/:dishId", (req, res) => {    
    Dish.findByIdAndUpdate(req.params.dishId, req.body.dish, (err, dish) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Dish updated: ", dish);
            res.redirect("/restaurants/" + req.params.id + "/" + dish._id);
        }
    });
})

// Delete a dish
router.delete("/:dishId", (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    })  
})

// Display page to create new dish
router.get("/new", (req, res) => {
    console.log(req.params.id);
    Restaurant.findById(req.params.id, (err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            res.render("dishes/new", {restaurant: restaurant});
        }
    })
});

// Route to create a dish
router.post("/", (req, res) => {
    const newDish = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        comment: req.body.comment,
    }

    Restaurant.findById(req.params.id, (err, rest) => {
        if (err) {
            console.log(err);
        } else {
            Dish.create(newDish, (err, dish) => {
                if (err) {
                    console.log(err);
                } else { 
                    // console.log(dish);
                    rest.dishes.push(dish);
                    rest.save();
                    // console.log("created dish: ", dish);
                    res.redirect("/restaurants/" + req.params.id);
                }
            })
        }
    })
    
});

module.exports = router;