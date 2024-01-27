import express, { Request, Response } from "express";
import { IsString, Length, IsNumber } from "class-validator";
import { findUserById, validatePassword, generateToken } from "./service";
import validateRequest from "../../middlewhere/validateRequest";

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
        return res
          .status(401)
          .json({ result: "error", message: "Invalid credentials" });
      }

      // 비밀번호 비교
      const validPassword = await validatePassword(password, user.password);
      if (validPassword) {
        const token = generateToken({ user_id: user.user_id });
        res.cookie("authorization", token, { httpOnly: true });
        res.status(200).json({
          result: "success",
          message: "로그인에 성공했습니다.",
        });
      } else {
        res
          .status(401)
          .json({ result: "error", message: "Invalid credentials" });
      }
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ result: "error", message: "Internal Server Error" });
    }
  }
);

export default router;
