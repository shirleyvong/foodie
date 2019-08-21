const passport = require("passport");
const User = require("../models/user");

exports.loginPage = (req, res) => {
    res.render("login");
}

exports.registerPage = (req, res) => {
    res.render("register");
}

exports.register = (req, res) => {
    let newUser = new User({username: req.body.username, displayName: req.body.username});
    User.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } 
        
        console.log("New user created " + registeredUser);
        
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Hey " + req.user.displayName + ", welcome to foodie :)");
            res.redirect("/diary/" + req.user.username);
        });
    })
}

exports.login = (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { 
            res.status(503);
            return res.render("error", {msg: "An unexpected error occured, please try again later"});
        }
        
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) { 
                res.status(503);
                return res.render("error", {msg: "An unexpected error occured, please try again later"});
            }
            
            res.redirect("/diary/" + req.user.username);
        })
    })(req, res);
};
   
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
};