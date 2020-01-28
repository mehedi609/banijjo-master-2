const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const api = require('./api');

const app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(cookieParser());

app.use(
  session({ secret: 'banijjo', saveUninitialized: false, resave: false }),
);

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/api', api);

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001'),
);
