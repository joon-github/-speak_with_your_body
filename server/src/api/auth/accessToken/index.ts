import express, { Request, Response } from "express";
import { newAccessToken } from "../../../utils/createToken";
import jwt, { JwtPayload } from "jsonwebtoken";
const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  try {
    const refreshTocken = req.cookies["refreshToken"];
    console.log("refreshTocken",refreshTocken)
    if (!refreshTocken) {
      return res.status(401).json({
        result: "error",
        message: "재로그인 해주세요.",
      });
    }
    const payload = jwt.verify(refreshTocken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    console.log("payload",payload)
    newAccessToken(payload, res, req);
    res.status(200).json({
      result: "success",
      message: "토큰 갱신에 성공했습니다.",
    });
  } catch (e) {
    console.error(e);
    res.status(401).json({
      result: "error",
      message: "재로그인 해주세요.",
    });
  }
});

export default router;