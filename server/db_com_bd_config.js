const mysql = require("mysql");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "microfin_ecom",
  password: "sikder!@#",
  database: "microfin_ecommerce"
});

module.exports = dbConnection;
