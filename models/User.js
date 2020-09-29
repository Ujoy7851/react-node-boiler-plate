const mongoose = require('mongoose');
const { use } = require('../routes');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: String,
  tokenExp: Number
});

userSchema.pre('save', function(next) {
  let user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if(err) {
        next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) {
          next(err);
        }
        user.password = hash;
      });
    });
  }
  next();
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if(err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
}

userSchema.methods.generateToken = function(cb) {
  let user = this;
  const token = jwt.sign({ id: user._id }, 'secretToken');
  user.token = token;
  user.save(function(err, user) {
    if(err) {
      return cb(err);
    }
    cb(null, user);
  });
}

const User = mongoose.model('User', userSchema);

module.exports = { User };