import mysql, { Connection, MysqlError } from "mysql";
import { config } from "dotenv"; // npm install dotenv
config();

const db_info = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default {
  init: function () {
    return mysql.createConnection(db_info);
  },
  connect: function (conn: Connection) {
    conn.connect(function (err: MysqlError) {
      if (err) console.error("mysql connection error :" + err);
      else console.log("mysql is connected successfully!");
    });
  },
};
