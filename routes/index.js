const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) {
      return res.json({ success: false, err })
    }
    return res.status(200).json({ success: true })
  });
});

module.exports = router;