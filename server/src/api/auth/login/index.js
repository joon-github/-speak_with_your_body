"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const class_validator_1 = require("class-validator");
const service_1 = require("./service");
const validateRequest_1 = __importDefault(require("../../../middlewhere/validateRequest"));
const createToken_1 = require("../../../utils/createToken");
class LoginRequest {
    constructor(id, password) {
        this.id = id;
        this.password = password;
    }
}
__decorate([
    (0, class_validator_1.IsString)({ message: "ID는 문자열이어야 합니다." }),
    __metadata("design:type", String)
], LoginRequest.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "비밀번호는 문자열이어야 합니다." }),
    __metadata("design:type", String)
], LoginRequest.prototype, "password", void 0);
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(LoginRequest), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password } = req.body;
        // 사용자 정보 조회
        const user = yield (0, service_1.findUserById)(id);
        if (!user) {
            return res.status(400).json({
                result: "error",
                message: "아이디 또는 비밀번호가 틀렸습니다.",
            });
        }
        // 비밀번호 비교
        const validPassword = yield (0, service_1.validatePassword)(password, user.password);
        if (validPassword) {
            (0, createToken_1.newAccessToken)(user, res, req);
            (0, createToken_1.newRefreshToken)(user, res);
            res.status(200).json({
                result: "success",
                message: "로그인에 성공했습니다.",
            });
        }
        else {
            res
                .status(400)
                .json({ result: "error", message: "아이디 또는 비밀번호가 틀렸습니다." });
        }
    }
    catch (e) {
        console.error("error : ", e);
        res
            .status(500)
            .json({ result: "error", message: "서버에러가 발생했습니다." });
    }
}));
exports.default = router;
