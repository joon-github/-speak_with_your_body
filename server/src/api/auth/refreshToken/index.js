"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createToken_1 = require("../../../utils/createToken");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    try {
        (0, createToken_1.newAccessToken)(req.user, res, req);
        (0, createToken_1.newRefreshToken)(req.user, res);
        res.status(200).json({
            result: "success",
            message: "토큰 갱신에 성공했습니다.",
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            result: "error",
            message: "서버에러가 발생했습니다.",
        });
    }
});
exports.default = router;
