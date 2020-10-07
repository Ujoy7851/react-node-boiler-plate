const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./models');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');
require('dotenv').config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ err });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});