import express, { Express, Request, Response } from "express";
import http from "http";

//미들웨어
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

//router
import authRouter from "./api/auth";
import verifyToken from "./middlewhere/verifyToken";
import initializeWebSocket from "./\bsocket/initializeWebSocket";

const app: Express = express();
const server = http.createServer(app);
const port = 8000;

// 미들웨어 적용
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Router
app.use("/auth", authRouter);

// 토큰 체크 미들웨어 적용
app.use(verifyToken);

app.get("/user_check", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      result: "success",
      message: "정상적인 로그인 상태 입니다.",
      data: req.user,
    });
  } catch (e) {
    console.log(e);
  }
});

initializeWebSocket(server);

server.listen(port, () => console.log("hi23sssassdfdf"));
