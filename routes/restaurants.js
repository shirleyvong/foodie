const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware/index")
const restaurantController = require('../controllers/restaurantController');

router.post("/", middleware.isLoggedIn, middleware.checkDiaryOwnership, restaurantController.restaurantCreate);

router.put("/:id", middleware.isLoggedIn, middleware.checkDiaryOwnership, restaurantController.restaurantEdit);

router.delete("/:id", middleware.isLoggedIn, middleware.checkDiaryOwnership, restaurantController.restaurantDelete);

router.get("/:id", restaurantController.restaurantDetail);

module.exports = router;