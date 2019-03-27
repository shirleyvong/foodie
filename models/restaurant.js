const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: String,
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);