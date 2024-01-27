"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password } = req.body;
        // 아이디 중복 검사
        const userExists = yield (0, service_1.checkUserExists)(id);
        if (userExists) {
            return res
                .status(409)
                .json({ result: "error", message: "이미 등록된 아이디가 있습니다." });
        }
        // 사용자 생성
        yield (0, service_1.createUser)(id, password);
        res.status(200).json({
            result: "success",
            message: "계정을 성공적으로 생성했습니다.",
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ result: "error", message: "Internal Server Error" });
    }
}));
exports.default = router;
