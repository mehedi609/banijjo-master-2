const mysql = require('mysql');
const { promisify } = require('util');

const dev_config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'microfin_ecommerce'
};

const live_config = {
  host: 'localhost',
  user: 'microfin_ecom',
  password: 'sikder!@#',
  database: 'microfin_ecommerce'
};

//Change here before go to live.
// const process_env = 'development';
const process_env = 'production';

let DB_Config;

if (process_env === 'development')
  DB_Config = mysql.createConnection(dev_config);
else if (process_env === 'production')
  DB_Config = mysql.createConnection(live_config);

DB_Config.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to Database...');
});

const query = promisify(DB_Config.query).bind(DB_Config);

module.exports = { query };
