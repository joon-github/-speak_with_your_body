import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { newAccessToken , newRefreshToken } from "../utils/createToken";


// 인증 실패시 에러 메시지를 반환합니다.
const authFail = (res: Response) => {
  return res.status(403).send({
    status: 403,
    message: "인증 실패.",
  });
}

// 인증 성공시 응답 메시지를 반환합니다.
const authSuccess = (res: Response) => {
  return res.status(200).send({
    status: 204,
    message: "인증 성공.",
  });
}

// verifyToken 미들웨어는 요청을 받을 때 마다 토큰을 검증합니다.
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 쿠키에서 'authorization' (액세스 토큰) 및 'refreshToken' (리프레시 토큰)을 가져옵니다.
  const token = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
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
    if (!refreshToken) {
      // 리프레시 토큰도 없는 경우, 에러 메시지를 반환합니다.
      authFail(res);
    }
    try {
      // 리프레시 토큰의 유효성을 검증합니다.
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
      // 리프레시 토큰이 유효할 경우, 새로운 액세스 토큰을 발급합니다.
      newAccessToken(decoded, res, req);
      authSuccess(res);
    } catch (refreshErr) {
      // 리프레시 토큰 검증이 실패했을 때의 처리입니다.
      if (refreshErr instanceof jwt.TokenExpiredError) {
        // 리프레시 토큰이 만료되었다면 새로운 리프레시 토큰을 발급합니다.
        newRefreshToken(decoded, res);
        newAccessToken(decoded, res, req);
        authSuccess(res);
      } else {
        // 기타 다른 오류들에 대한 처리입니다.
        authFail(res);
      }
    }
  }
};

export default verifyToken;
