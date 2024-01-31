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
    // mysql 모듈을 이용해 커넥션을 생성합니다.
    // 성공하면 콘솔창에 메시지를 출력합니다.
    const conn = mysql.createConnection(db_info);
    conn.connect(function (err: MysqlError) {
      if (err) console.error("mysql connection error : " + err);
      else console.log("mysql is connected successfully!");
    });

    return conn;
  },
  connect: function (conn: Connection) {
    conn.connect(function (err: MysqlError) {
      if (err) console.error("mysql connection error :" + err);
      else console.log("mysql is connected successfully!");
    });
  },
};
