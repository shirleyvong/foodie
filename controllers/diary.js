const Diary = require('../models/diary');

const createDiary = (req, res) => {
  const newDiary = {
    name: req.body.name,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  };

  Diary.create(newDiary, (err, diary) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    req.flash('success', `Created new diary ${diary.name}`);
    return res.redirect(`/${req.user.username}`);
  });
};

const editDiary = (req, res) => {
  Diary.findByIdAndUpdate(req.params.id, req.body.diary, (err, diary) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    if (!diary) {
      res.status(404);
      return res.render('error', {
        msg: 'The diary you are trying to update does not exist.',
      });
    }

    req.flash('success', 'Sucessfully updated diary');
    return res.redirect(`/${req.user.username}/diaries/${req.params.id}`);
  });
};

const deleteDiary = (req, res) => {
  Diary.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    req.flash('success', 'Sucessfully deleted diary.');
    return res.redirect(`/${req.user.username}`);
  });
};

const getDiary = (req, res) => {
  Diary.findById(req.params.id).populate('posts').exec((err, diary) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    if (!diary) {
      res.status(404);
      return res.render('error', {
        msg: 'The diary you are trying to access does not exist.',
      });
    }

    return res.render('diary', {
      diary,
      user: req.params.username,
      currentUser: req.user,
    });
  });
};

module.exports = {
  createDiary,
  editDiary,
  deleteDiary,
  getDiary,
};
