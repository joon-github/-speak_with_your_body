"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 인증 실패시 에러 메시지를 반환합니다.
const authFail = (res) => {
    return res.status(402).send({
        status: 402,
        message: "인증 실패2",
    });
};
// verifyToken 미들웨어는 요청을 받을 때 마다 토큰을 검증합니다.
const verifyToken = (req, res, next) => {
    // 쿠키에서 'authorization' (액세스 토큰) 및 'refreshToken' (리프레시 토큰)을 가져옵니다.
    const token = req.cookies["accessToken"];
    // 액세스 토큰이 없는 경우, 에러 메시지를 반환합니다.
    let decoded = jsonwebtoken_1.default.decode(token);
    if (!token) {
        authFail(res);
    }
    try {
        // jwt.verify를 사용하여 토큰을 검증하고, 디코딩된 정보를 req.user에 할당합니다.
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        // 액세스 토큰 검증이 실패했을 때의 처리입니다.
        authFail(res);
    }
};
exports.default = verifyToken;
