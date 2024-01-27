declare namespace Express {
  export interface Request {
    user?: any; // JwtPayload 또는 다른 타입으로 지정 가능
  }
}
