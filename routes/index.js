const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.get('/', (req, res, next) => {
  res.send('Hello World!');
});

router.post('/register', (req, res, next) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) {
      // return res.json({ success: false, err });
      next(err);
    }
    return res.status(200).json({ success: true });
    
  });
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일을 찾을 수 없습니다."
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(err) {
        next(err);
      }
      if(!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다"
        });
      }
      user.generateToken((err, user) => {
        if(err) {
          next(err);
        }
        res.cookie('x_auth', user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          });
      });
    })
  } catch(err) {
    next(err);
  }
})

module.exports = router;