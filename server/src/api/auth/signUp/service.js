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
exports.createUser = exports.checkUserExists = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mysqlConnector = database_1.default.init();
const checkUserExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const checkSql = "SELECT * FROM s_user WHERE id = ?";
    return new Promise((resolve, reject) => {
        mysqlConnector.query(checkSql, [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.length > 0);
            }
        });
    });
});
exports.checkUserExists = checkUserExists;
const createUser = (id, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const insertSql = "INSERT INTO s_user (id, password, name) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
        mysqlConnector.query(insertSql, [id, hashedPassword, name], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
});
exports.createUser = createUser;
