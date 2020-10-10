const Diary = require('../models/diary.js');
const Post = require('../models/post.js');

const getPost = (req, res) => {
  Diary.findById(req.params.id, (err, diary) => {
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

    Post.findById(req.params.postId, (err, post) => {
      if (err) {
        res.status(503);
        return res.render('error', {
          msg: 'An unexpected error occured, please try again later.',
        });
      }

      if (!post) {
        res.status(404);
        return res.render('error', {
          msg: 'The post you are trying to update does not exist.',
        });
      }

      return res.render('post', {
        post,
        diary,
        user: req.params.username,
        currentUser: req.user,
      });
    });
  });
};

const editPost = (req, res) => {
  const updatedPost = {
    image: req.body.image,
    comment: req.body.comment,
  };

  Post.findByIdAndUpdate(req.params.postId, updatedPost, (err, post) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    if (!post) {
      res.status(404);
      return res.render('error', {
        msg: 'The post you are trying to update does not exist.',
      });
    }

    req.flash('success', 'Successfully updated post');
    return res.redirect(`/${req.user.username}/diaries/${req.params.id}/posts/${post._id}`);
  });
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.postId, (err) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    req.flash('success', 'Successfully deleted post');
    return res.redirect(`/${req.user.username}/diaries/${req.params.id}`);
  });
};

const createPost = (req, res) => {
  Diary.findById(req.params.id, (err, diary) => {
    if (err) {
      res.status(503);
      return res.render('error', {
        msg: 'An unexpected error occured, please try again later.',
      });
    }

    const newPost = {
      image: req.body.image,
      comment: req.body.comment,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    };

    Post.create(newPost, (err, post) => {
      if (err) {
        res.status(503);
        return res.render('error', {
          msg: 'An unexpected error occured, please try again later.',
        });
      }

      diary.posts.push(post);
      diary.save();

      req.flash('success', 'Successfully created new post');
      return res.redirect(`/${req.user.username}/diaries/${req.params.id}`);
    });
  });
};

module.exports = {
  getPost,
  editPost,
  deletePost,
  createPost,
};
