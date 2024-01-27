import express, { Express, Request, Response } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";

//미들웨어
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

//router
import loginRouter from "./api/login";
import signUpRouter from "./api/signUp";
import verifyToken from "./middlewhere/verifyToken";

const { body } = require("express-validator");

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
app.use("/login", loginRouter);
app.use("/sign_up", signUpRouter);

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

app.get(
  "/test/:id",

  (req: Request, res: Response) => {
    //params type check
    const { id: string } = req.params;
    console.log(string);

    console.log(req.params);
    console.log(req.query);
    res.send("indexsdsdsdff");
  }
);

//타입 체크 함수

interface CreateUserRequestBody {
  username: string;
  email: string;
  password: number;
}

app.post(
  "/test",
  [
    body("username").isString(),
    body("email").isString(),
    body("password").isLength({ min: 1 }),
  ],
  (req: Request, res: Response) => {
    const { username, email, password } = req.body as CreateUserRequestBody;
    res.send("indexsdsdsdff");
  }
);

/* 웹소켓 관련 코드 */
const wsServer: SocketIOServer = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust this for production
  },
});

wsServer.on("connection", (socket: Socket) => {
  // 방리스트 조회 함수
  function getRoomList() {
    const adapter = wsServer.sockets.adapter;
    const newRoomList = [...adapter.rooms.keys()] // 모든 방 리스트에서
      .filter((room) => !adapter.sids.has(room));
    return newRoomList;
  }

  // 방리스트 보내기
  function sendRoomList() {
    const roomList = getRoomList();
    wsServer.emit("get_room_list", roomList); // 방리스트를 보내준다.
  }

  //방 인원수 조회
  function countRoom(roomName: string, isDisconnecting: boolean) {
    const room = wsServer.sockets.adapter.rooms.get(roomName);
    if (room) {
      const count = room.size;
      wsServer
        .to(roomName)
        .emit("count_room", isDisconnecting ? count - 1 : count);
    } else {
      console.log(`Room ${roomName} doesn't exist.`);
    }
  }

  socket.onAny((event) => {
    // console.log(wsServer.sockets.adapter);
  });

  /* 최초 입장시 */
  socket.on("welcome", () => {
    const roomList = getRoomList();
    console.log(socket);
    socket.emit("get_room_list", roomList); // 방리스트를 보내준다.
  });

  /* 방 입장시 */
  socket.on("enter_room", async (roomName: string, callback) => {
    const roomList = getRoomList(); // 방리스트
    await socket.join(roomName); // 방에 입장 및 생성

    if (!roomList.includes(roomName)) {
      // 새로운 방이 생성되면
      sendRoomList();
    }
    countRoom(roomName, false);
    callback(roomName); // front에서 실행됌
  });

  /* 방 퇴장시 */
  socket.on("disconnect", () => {
    sendRoomList();
  });

  /* 메세지 */
  socket.on("to_server_message", (msg, room) => {
    wsServer.to(room).emit("to_client_message", msg); //방 전체 전송 (발신자 포함)
  });

  /* 서버 퇴장시 */
  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", countRoom(room, true));
    });
  });
});
server.listen(port, () => console.log("hi23sssassdfdf"));
