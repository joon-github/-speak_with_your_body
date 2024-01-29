"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
//미들웨어
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//router
const auth_1 = __importDefault(require("./api/auth"));
const verifyToken_1 = __importDefault(require("./middlewhere/verifyToken"));
const initializeWebSocket_1 = __importDefault(require("./\bsocket/initializeWebSocket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = 8000;
// 미들웨어 적용
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
//Router
app.use("/auth", auth_1.default);
// 토큰 체크 미들웨어 적용
app.use(verifyToken_1.default);
app.get("/user_check", (req, res) => {
    try {
        res.status(200).json({
            result: "success",
            message: "정상적인 로그인 상태 입니다.",
            data: req.user,
        });
    }
    catch (e) {
        console.log(e);
    }
});
(0, initializeWebSocket_1.default)(server);
server.listen(port, () => console.log("hi23sssassdfdf"));
