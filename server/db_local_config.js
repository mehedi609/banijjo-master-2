const mysql = require('mysql');
const util = require('util');

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  // database: "ecommerce"
  database: 'microfin_ecommerce'
});

/*dbConnection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("Connected to local database");
});*/

const query = util.promisify(dbConnection.query).bind(dbConnection);

module.exports = { dbConnection, query };
