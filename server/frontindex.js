const express = require('express');
const cors = require('cors');
const api = require('./api');

const app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', api);

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001'),
);
