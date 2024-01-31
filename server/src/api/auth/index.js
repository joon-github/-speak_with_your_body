"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("./login")); // Adjust the path as necessary
const signUp_1 = __importDefault(require("./signUp")); // Adjust the path as necessary
const logout_1 = __importDefault(require("./logout"));
const refreshToken_1 = __importDefault(require("./refreshToken"));
const authRouter = express_1.default.Router();
authRouter.use("/login", login_1.default);
authRouter.use("/logout", logout_1.default);
authRouter.use("/sign_up", signUp_1.default);
authRouter.use("/refreshToken", refreshToken_1.default);
exports.default = authRouter;
