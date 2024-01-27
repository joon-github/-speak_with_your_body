import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["authorization"];
  if (!token) {
    return res
      .status(403)
      .send({ status: 403, message: "인증에 실패했습니다." });
  }

  try {
    // 타입 단언을 사용하여 디코딩된 페이로드의 타입을 JwtPayload로 지정
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded; // Express의 Request 타입을 확장해야 할 수도 있습니다.
    next();
  } catch (err) {
    return res.status(401).send({
      status: 401,
      message: "잘못된 토큰 또는 토큰이 만료되었습니다.",
    });
  }
};

export default verifyToken;
