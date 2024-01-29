"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken_1 = require("../utils/createToken");
// 인증 실패시 에러 메시지를 반환합니다.
const authFail = (res) => {
    return res.status(403).send({
        status: 403,
        message: "인증 실패.",
    });
};
// 인증 성공시 응답 메시지를 반환합니다.
const authSuccess = (res) => {
    return res.status(204).send({
        status: 204,
        message: "인증 성공",
    });
};
// verifyToken 미들웨어는 요청을 받을 때 마다 토큰을 검증합니다.
const verifyToken = (req, res, next) => {
    // 쿠키에서 'authorization' (액세스 토큰) 및 'refreshToken' (리프레시 토큰)을 가져옵니다.
    const token = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
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
        if (!refreshToken) {
            // 리프레시 토큰도 없는 경우, 에러 메시지를 반환합니다.
            authFail(res);
        }
        try {
            // 리프레시 토큰의 유효성을 검증합니다.
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // 리프레시 토큰이 유효할 경우, 새로운 액세스 토큰을 발급합니다.
            (0, createToken_1.newAccessToken)(decoded, res, req);
            authSuccess(res);
        }
        catch (refreshErr) {
            // 리프레시 토큰 검증이 실패했을 때의 처리입니다.
            authFail(res);
        }
    }
};
exports.default = verifyToken;
