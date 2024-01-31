"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRefreshToken = exports.newAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//토큰 생성
const generateToken = (payload, secret, expiresIn) => {
    if (!secret)
        throw new Error("JWT_SECRET is not defined");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
// 액세스 토큰을 쿠키에 저장합니다.
const newAccessToken = (decoded, res, req) => {
    const newAccessToken = generateToken({ user_id: decoded === null || decoded === void 0 ? void 0 : decoded.user_id, name: decoded.name }, process.env.JWT_SECRET, "1H");
    // accessToken을 쿠키에 저장합니다.
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
    });
    req.user = jsonwebtoken_1.default.decode(newAccessToken);
};
exports.newAccessToken = newAccessToken;
// 리프레시 토큰을 쿠키에 저장합니다.
const newRefreshToken = (decoded, res) => {
    const newRefreshToken = generateToken({ user_id: decoded === null || decoded === void 0 ? void 0 : decoded.user_id }, process.env.REFRESH_TOKEN_SECRET, "1D");
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: '/auth/refreshToken'
    });
};
exports.newRefreshToken = newRefreshToken;
