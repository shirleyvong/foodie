const passport = require('passport');
const User = require('../models/user');
const Diary = require('../models/diary');

const loginPage = (req, res) => {
  res.render('login');
};

const registerPage = (req, res) => {
  res.render('register');
};

const register = (req, res) => {
  const newUser = new User({ username: req.body.username, displayName: req.body.username });
  User.register(newUser, req.body.password, (err, registeredUser) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }

    console.log(`New user created ${registeredUser}`);

    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Hey ${req.user.displayName}, welcome to foodie :)`);
      res.redirect(`/${req.user.username}`);
    });
  });
};

const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(503);
      return res.render('error', { msg: 'An unexpected error occured, please try again later' });
    }

    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        res.status(503);
        return res.render('error', { msg: 'An unexpected error occured, please try again later' });
      }

      res.redirect(`/${req.user.username}`);
    });
  })(req, res);
};

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const homePage = (req, res) => {
  if (req.user) {
    return res.redirect(`/${req.user.username}`);
  }
  return res.render('home');
};

const userPage = (req, res, next) => {
  const username = req.params.username.toLowerCase();
  User.findOne({ username }, (err, foundUser) => {
    if (err || !foundUser) {
      return res.render('error');
    }

    Diary.find({ 'author.username': username }).populate('posts').exec((err, diaries) => {
      if (err) {
        return res.render('error');
      }
      return res.render('diaries', {
        exists: true,
        diaries,
        user: username,
        currentUser: req.user,
        displayName: foundUser.displayName,
      });
    });
  });
};

const search = (req, res) => {
  const username = req.query.username.toLowerCase();
  res.redirect(`/${username}`);
};

module.exports = {
  loginPage,
  registerPage,
  register,
  login,
  logout,
  homePage,
  userPage,
  search,
};
