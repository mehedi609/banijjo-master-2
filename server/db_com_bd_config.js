const mysql = require("mysql");
const util = require("util");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "microfin_ecom",
  password: "sikder!@#",
  database: "microfin_ecommerce"
});

const query = util.promisify(dbConnection.query).bind(dbConnection);

module.exports = {dbConnection, query};
