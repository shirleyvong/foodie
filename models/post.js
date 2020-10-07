const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: String,
  comment: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});

module.exports = mongoose.model('Post', postSchema);
