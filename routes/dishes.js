const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware/index")
const dishController = require('../controllers/dishController');

router.get("/:dishId", dishController.dishDetail);

router.put("/:dishId", middleware.isLoggedIn, middleware.checkDiaryOwnership, dishController.dishEdit);

router.delete("/:dishId", middleware.isLoggedIn, middleware.checkDiaryOwnership, dishController.dishDelete);

router.post("/", middleware.isLoggedIn, middleware.checkDiaryOwnership, dishController.dishCreate);

module.exports = router;