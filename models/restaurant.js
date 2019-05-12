const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: String,
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);