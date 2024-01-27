"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // 타입 단언을 사용하여 디코딩된 페이로드의 타입을 JwtPayload로 지정
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Express의 Request 타입을 확장해야 할 수도 있습니다.
    }
    catch (err) {
        return res.status(401).send("Invalid Token or Token has expired");
    }
    return next();
};
exports.default = verifyToken;
