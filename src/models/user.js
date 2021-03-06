/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  createdAt: { type: Date },

  username: { type: String, required: true },
  password: { type: String, select: false },

  fName: { type: String, required: true },
  lName: { type: String, required: true },
  slug: { type: String, required: true },

  portfolio: [{ type: Schema.Types.ObjectId, ref: 'Portfolio' }],
});

UserSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
