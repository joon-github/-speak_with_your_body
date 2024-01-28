import express, { Request, Response } from "express";
import { checkUserExists, createUser } from "./service";
import { IsString, Length, Matches } from "class-validator";
import validateRequest from "../../middlewhere/validateRequest";

const router = express.Router();

class SignUpRequest {
  @IsString({ message: "ID는 문자열이어야 합니다." })
  id: string;

  @IsString({ message: "이름은 문자열이어야 합니다." })
  @Matches(/^[^\s,.]+$/, {
    message: "특수문자, 공백, 쉼표, 마침표는 사용할 수 없습니다.",
  })
  name: string;

  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @Length(10, 20, {
    message: "비밀번호는 10글자 이상 20글자 이하이어야 합니다.",
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: "비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.",
  })
  password: string;

  constructor(id: string, password: string, name: string) {
    this.id = id;
    this.password = password;
    this.name = name;
  }
}

router.post(
  "/",
  validateRequest(SignUpRequest),
  async (req: Request, res: Response) => {
    try {
      const { id, password } = req.body;

      // 아이디 중복 검사
      const userExists = await checkUserExists(id);
      if (userExists) {
        return res
          .status(409)
          .json({ result: "error", message: "이미 등록된 아이디가 있습니다." });
      }

      // 사용자 생성
      await createUser(id, password);

      res.status(200).json({
        result: "success",
        message: "계정을 성공적으로 생성했습니다.",
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ result: "error", message: "Internal Server Error" });
    }
  }
);

export default router;
