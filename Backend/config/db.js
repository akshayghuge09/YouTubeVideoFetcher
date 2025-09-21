const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Akshay123", 
  database: "serri_Db"
});

module.exports = pool;
