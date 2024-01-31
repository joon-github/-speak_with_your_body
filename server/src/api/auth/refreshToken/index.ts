import express, { Request, Response } from "express";
import { newAccessToken, newRefreshToken } from "../../../utils/createToken";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    newAccessToken(req.user, res, req);
    newRefreshToken(req.user, res);
    res.status(200).json({
      result: "success",
      message: "토큰 갱신에 성공했습니다.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      result: "error",
      message: "서버에러가 발생했습니다.",
    });
  }
});

export default router;