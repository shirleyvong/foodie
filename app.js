const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const session = require('express-session');
const restaurantRoutes = require('./routes/restaurants.js');
const dishRoutes = require('./routes/dishes.js');
const indexRoutes = require('./routes/index.js');
const User = require('./models/user.js');
const middleware = require('./middleware');

const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }, (error) => {
  if (error) {
    console.log(`Error connecting to MongoDB at ${config.MONGODB_URI}`);
  } else {
    console.log(`Connected to MongoDB at ${config.MONGODB_URI}`);
  }
});

app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Set up user authentication
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(middleware.setResLocals);

app.use('/diary/:username/restaurants', restaurantRoutes);
app.use('/diary/:username/restaurants/:id/dishes/', dishRoutes);
app.use('/', indexRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
