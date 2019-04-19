const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require("./models/user.js");

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
    next();
});

// Routes
var restaurantRoutes = require("./routes/restaurants.js");
var dishRoutes = require("./routes/dishes.js");

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }

        passport.authenticate("local")(req, res, () => {
            res.redirect("/restaurants");
        });
    })
})


app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id", dishRoutes);

app.listen(port, () => {
    console.log("Listening from port " + port);
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }

    res.redirect("/login");
}
