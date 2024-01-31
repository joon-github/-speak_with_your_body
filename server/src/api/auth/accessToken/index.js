"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createToken_1 = require("../../../utils/createToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post("/", (req, res) => {
    try {
        const refreshTocken = req.cookies["refreshToken"];
        console.log("refreshTocken", refreshTocken);
        if (!refreshTocken) {
            return res.status(401).json({
                result: "error",
                message: "재로그인 해주세요.",
            });
        }
        const payload = jsonwebtoken_1.default.verify(refreshTocken, process.env.REFRESH_TOKEN_SECRET);
        console.log("payload", payload);
        (0, createToken_1.newAccessToken)(payload, res, req);
        res.status(200).json({
            result: "success",
            message: "토큰 갱신에 성공했습니다.",
        });
    }
    catch (e) {
        console.error(e);
        res.status(401).json({
            result: "error",
            message: "재로그인 해주세요.",
        });
    }
});
exports.default = router;
