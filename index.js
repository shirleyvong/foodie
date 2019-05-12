const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require("connect-flash");
const User = require("./models/user.js");

app.use(flash());

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/testdb")

// Configure view engine to render ejs templates
app.use(express.static('public'));   // style sheets are located in public
app.set("view engine", "ejs");

// Passport config
app.use(require("express-session")({
    secret: "this is the secret",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes
var restaurantRoutes = require("./routes/restaurants.js");
var dishRoutes = require("./routes/dishes.js");
var indexRoutes = require("./routes/index.js")

app.use("/diary/:username/restaurants", restaurantRoutes);
app.use("/diary/:username/restaurants/:id/dishes/", dishRoutes);
app.use("/", indexRoutes)

app.listen(port, () => {
    console.log("Listening from port " + port);
});
