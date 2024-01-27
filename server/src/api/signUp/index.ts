import express, { Request, Response } from "express";
import { checkUserExists, createUser } from "./service";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
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
    res.status(500).json({ result: "error", message: "Internal Server Error" });
  }
});

export default router;
