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

userSchema.pre('save', async function(next) {
  try {
    let user = this;
    if(user.isModified('password')) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
    next();
  } catch(err) {
    console.error(err);
    next(err);
  }
});

userSchema.methods.comparePassword = async function(plainPassword, cb) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, this.password)
    cb(null, isMatch);
  } catch(err) {
    console.error(err);
    cb(err);
  }
}

userSchema.methods.generateToken = async function(cb) {
  try {
    let user = this;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.token = token;
    const userInfo = await user.save();
    cb(null, userInfo);
  } catch(err) {
    console.error(err);
    cb(err);
  }
}

userSchema.statics.findByToken = async function(token, cb) {
  try {
    let user = this;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const userInfo = await user.findOne({
      '_id' : decoded.id, 'token': token
    });
    // console.log('userInfo', userInfo)
    cb(null, userInfo)
  } catch(err) {
    console.error(err);
    cb(err);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = { User };