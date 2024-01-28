import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken } from "../api/login/service";

// verifyToken 미들웨어는 요청을 받을 때 마다 토큰을 검증합니다.
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 쿠키에서 'authorization' (액세스 토큰) 및 'refreshToken' (리프레시 토큰)을 가져옵니다.
  const token = req.cookies["authorization"];
  const refreshToken = req.cookies["refreshToken"];
  // 액세스 토큰이 없는 경우, 에러 메시지를 반환합니다.
  let decoded = jwt.decode(token) as JwtPayload | null;
  if (!token) {
    return res
      .status(403)
      .send({ status: 403, message: "인증 실패. 토큰이 제공되지 않았습니다." });
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
      return res.status(401).send({
        status: 401,
        message: "유효하지 않은 토큰이며 리프레시 토큰도 사용할 수 없습니다.",
      });
    }

    try {
      // 리프레시 토큰의 유효성을 검증합니다.
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

      // 리프레시 토큰이 유효할 경우, 새로운 액세스 토큰을 발급합니다.
      const newAccessToken = generateToken(
        { user_id: decoded?.user_id },
        process.env.JWT_SECRET,
        "5s"
      );

      // 새로운 액세스 토큰을 쿠키에 설정합니다.
      res.cookie("authorization", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      req.user = jwt.decode(newAccessToken) as JwtPayload;
      next();
    } catch (refreshErr) {
      // 리프레시 토큰 검증이 실패했을 때의 처리입니다.
      console.log(refreshErr instanceof jwt.TokenExpiredError);
      if (refreshErr instanceof jwt.TokenExpiredError) {
        // 리프레시 토큰이 만료되었다면 새로운 리프레시 토큰을 발급합니다.

        const token = generateToken(
          { user_id: decoded?.user_id },
          process.env.JWT_SECRET,
          "1H"
        );
        const newRefreshToken = generateToken(
          { user_id: decoded?.user_id },
          process.env.REFRESH_TOKEN_SECRET,
          "1D"
        );
        res.cookie("authorization", token, { httpOnly: true });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
        });

        res
          .status(200)
          .send({ message: "새로운 리프레시 토큰이 발급되었습니다." });
      } else {
        // 기타 다른 오류들에 대한 처리입니다.
        return res.status(401).send({
          status: 401,
          message: "유효하지 않은 리프레시 토큰입니다.",
        });
      }
    }
  }
};

export default verifyToken;
