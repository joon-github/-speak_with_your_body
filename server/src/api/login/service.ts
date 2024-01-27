import database from "../../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const mysqlConnector = database.init();

interface User {
  user_id: number;
  id: string;
  password: string;
}

interface Payload {
  user_id: number;
  id?: string;
  password?: string;
}

// 유저 찾기
const findUserById = async (id: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM s_user WHERE id = ?";
    mysqlConnector.query(sql, [id], (error, results: User[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};

// 패스워드 검증
const validatePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

//토큰 생성
const generateToken = (payload: Payload) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export { findUserById, validatePassword, generateToken };
