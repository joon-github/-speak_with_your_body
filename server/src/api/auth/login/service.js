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
exports.generateToken = exports.validatePassword = exports.findUserById = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mysqlConnector = database_1.default.init();
// 유저 찾기
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM s_user WHERE id = ?";
        mysqlConnector.query(sql, [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
});
exports.findUserById = findUserById;
// 패스워드 검증
const validatePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hash);
});
exports.validatePassword = validatePassword;
//토큰 생성
const generateToken = (payload, secret, expiresIn) => {
    if (!secret)
        throw new Error("JWT_SECRET is not defined");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateToken = generateToken;
