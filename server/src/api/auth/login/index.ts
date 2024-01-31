import express, { Request, Response } from "express";
import { IsString } from "class-validator";
import { findUserById, validatePassword, generateToken } from "./service";
import validateRequest from "../../../middlewhere/validateRequest";
import { newAccessToken, newRefreshToken } from "../../../utils/createToken";

class LoginRequest {
  @IsString({ message: "ID는 문자열이어야 합니다." })
  id: string;

  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  password: string;
  constructor(id: string, password: string) {
    this.id = id;
    this.password = password;
  }
}

const router = express.Router();
router.post(
  "/",
  validateRequest(LoginRequest),
  async (req: Request, res: Response) => {
    try {
      const { id, password } = req.body;
      // 사용자 정보 조회
      const user = await findUserById(id);
      if (!user) {
        return res.status(400).json({
          result: "error",
          message: "아이디 또는 비밀번호가 틀렸습니다.",
        });
      }
      // 비밀번호 비교
      const validPassword = await validatePassword(password, user.password);
      if (validPassword) {
        newAccessToken(user, res, req);
        newRefreshToken(user, res);
        res.status(200).json({
          result: "success",
          message: "로그인에 성공했습니다.",
        });
      } else {
        res
          .status(400)
          .json({ result: "error", message: "아이디 또는 비밀번호가 틀렸습니다." });
      }
    } catch (e) {
      console.error("error : ",e);
      res
        .status(500)
        .json({ result: "error", message: "서버에러가 발생했습니다." });
    }
  }
);

export default router;
