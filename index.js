const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./models');

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});