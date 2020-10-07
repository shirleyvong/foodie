const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// TODO: Add middleware to validate usernames so we don't need to use lowercase
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
  },
  password: String,
  displayName: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
