const Post = require('../models/post');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401);
  return res.render('error', {
    msg: 'You must login to be able to do this.',
  });
};

const checkDiaryOwnership = (req, res, next) => {
  if (req.params.username === req.user.username) {
    return next();
  }

  res.status(403);
  return res.render('error', {
    msg: 'You do not have permission to do this',
  });
};

const checkPostOwnership = (req, res, next) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again',
      });
    }

    if (foundPost.author.id.equals(req.user._id)) {
      return next();
    }

    res.status(403);
    return res.render('error', {
      msg: 'You do not have permission to do this',
    });
  });
};

const usernameToLower = (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  next();
};

const unknownEndpoint = (req, res, next) => {
  const err = new Error('Page not found');
  err.statusCode = 404;
  console.log(err);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500);
  return res.render('error');
};

const setResLocals = (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
};

module.exports = {
  isLoggedIn,
  checkDiaryOwnership,
  checkPostOwnership,
  usernameToLower,
  unknownEndpoint,
  errorHandler,
  setResLocals,
};
