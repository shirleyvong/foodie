const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    comment: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Dish", dishSchema);