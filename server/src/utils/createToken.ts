import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Payload {
  user_id: number;
  id?: string;
  name?: string;
  password?: string;
}

//토큰 생성
const generateToken = (
  payload: Payload,
  secret: string | undefined,
  expiresIn: string
) => {
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, secret, { expiresIn });
};

// 액세스 토큰을 쿠키에 저장합니다.
export const newAccessToken = (decoded: any, res: Response, req: Request) => {
  const newAccessToken = generateToken(
    { user_id: decoded?.user_id, name: decoded.name },
    process.env.JWT_SECRET,
    "1H"
  );
  // accessToken을 쿠키에 저장합니다.
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "strict",
  });
  req.user = jwt.decode(newAccessToken) as JwtPayload;
};

// 리프레시 토큰을 쿠키에 저장합니다.
export const newRefreshToken = (decoded: any, res: Response) => {
  const newRefreshToken = generateToken(
    { user_id: decoded?.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    "1D"
  );
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });
};
