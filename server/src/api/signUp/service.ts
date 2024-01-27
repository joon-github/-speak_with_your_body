import database from "../../config/database";
import bcrypt from "bcrypt";

const mysqlConnector = database.init();

const checkUserExists = async (id: string): Promise<boolean> => {
  const checkSql = "SELECT * FROM s_user WHERE id = ?";
  return new Promise((resolve, reject) => {
    mysqlConnector.query(checkSql, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

const createUser = async (id: string, password: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertSql = "INSERT INTO s_user (id, password) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    mysqlConnector.query(insertSql, [id, hashedPassword], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export { checkUserExists, createUser };
