import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// 인증 실패시 에러 메시지를 반환합니다.
const authFail = (res: Response) => {
  return res.status(402).send({
    status: 402,
    message: "인증 실패2",
  });
}

// verifyToken 미들웨어는 요청을 받을 때 마다 토큰을 검증합니다.
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 쿠키에서 'authorization' (액세스 토큰) 및 'refreshToken' (리프레시 토큰)을 가져옵니다.
  const token = req.cookies["accessToken"];

  // 액세스 토큰이 없는 경우, 에러 메시지를 반환합니다.
  let decoded = jwt.decode(token) as JwtPayload | null;
  if (!token) {
    authFail(res);
  }
  try {
    // jwt.verify를 사용하여 토큰을 검증하고, 디코딩된 정보를 req.user에 할당합니다.
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    // 액세스 토큰 검증이 실패했을 때의 처리입니다.
    authFail(res)
  }
}


export default verifyToken;
