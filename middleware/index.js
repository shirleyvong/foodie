const Diary = require('../models/diary');
const Post = require('../models/post');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // User is not logged in
  res.status(401);
  return res.render('error', { msg: 'You must login to be able to do this.' });
};

exports.checkDiaryOwnership = (req, res, next) => {
  if (req.params.username == req.user.username) {
    return next();
  }
  // User is not author
  res.status(403);
  return res.render('error', { msg: 'You do not have permission to do this' });
};

// exports.checkDiaryOwnership = (req, res, next) => {
//   Diary.findById(req.params.id, (err, foundDiary) => {
//     if (err) {
//       res.status(503);
//       return res.render('error', { msg: 'An unexpected error occured, please try again' });
//     }

//     if (foundDiary.author.id.equals(req.user._id)) {
//       return next();
//     }
//     // User is not the author
//     res.sendStatus(403);
//     return res.render('error', { msg: 'You do not have permission to do this' });
//   });
// };

exports.checkPostOwnership = (req, res, next) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.status(503);
      return res.render('error', { msg: 'An unexpected error occured, please try again' });
    }

    // Check that user is the author
    if (foundPost.author.id.equals(req.user._id)) {
      return next();
    }
    // User is not author
    res.status(403);
    return res.render('error', { msg: 'You do not have permission to do this' });
  });
};

exports.usernameToLower = (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  next();
};

exports.unknownEndpoint = (req, res, next) => {
  const err = new Error('Page not found');
  err.statusCode = 404;
  console.log(err);
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  if (!err.statusCode) { err.statusCode = 500; }
  console.log(err);
  res.status(err.statusCode).render('error');
};

exports.setResLocals = (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
};
