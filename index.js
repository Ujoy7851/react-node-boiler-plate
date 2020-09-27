const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./models');
const indexRouter = require('./routes');
require('dotenv').config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});