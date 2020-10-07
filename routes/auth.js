const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

router.get('/', auth, (req, res) => {
  res.status(200)
    .json({
      // _id: req.user._id,
      // isAdmin: req.user.role !== 0,
      // isAuth: true,
      // email: req.user.email,
      // name: req.user.name,
      // lastname: req.user.lastname,
      // role: req.user.role,
      // image: req.user.image
      user: req.user,
      isAuth: true
    });
});

module.exports = router;