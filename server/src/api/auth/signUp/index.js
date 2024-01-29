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
const service_1 = require("./service");
const class_validator_1 = require("class-validator");
const validateRequest_1 = __importDefault(require("../../../middlewhere/validateRequest"));
const router = express_1.default.Router();
class SignUpRequest {
    constructor(id, password, name) {
        this.id = id;
        this.password = password;
        this.name = name;
    }
}
__decorate([
    (0, class_validator_1.IsString)({ message: "ID는 문자열이어야 합니다." }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "이름은 문자열이어야 합니다." }),
    (0, class_validator_1.Matches)(/^[^\s,.]+$/, {
        message: "특수문자, 공백, 쉼표, 마침표는 사용할 수 없습니다.",
    }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "비밀번호는 문자열이어야 합니다." }),
    (0, class_validator_1.Length)(10, 20, {
        message: "비밀번호는 10글자 이상 20글자 이하이어야 합니다.",
    }),
    (0, class_validator_1.Matches)(/[^A-Za-z0-9]/, {
        message: "비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.",
    }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "password", void 0);
router.post("/", (0, validateRequest_1.default)(SignUpRequest), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password, name } = req.body;
        // 아이디 중복 검사
        const userExists = yield (0, service_1.checkUserExists)(id);
        if (userExists) {
            return res
                .status(409)
                .json({ result: "error", message: "이미 등록된 아이디가 있습니다." });
        }
        // 사용자 생성
        yield (0, service_1.createUser)(id, password, name);
        res.status(200).json({
            result: "success",
            message: "계정을 성공적으로 생성했습니다.",
        });
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ result: "error", message: "Internal Server Error" });
    }
}));
exports.default = router;
