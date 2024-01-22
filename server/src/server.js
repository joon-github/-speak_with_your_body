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
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 8000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const indexRouter = require('./routes');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/test', indexRouter);
// /test/{id}
// app.get('/test/:id', (req: Request, res: Response) => {
//   console.log(req.params);
//   console.log(req.query);
//   res.send('indexsdsdsdff');
// })
/* 웹소켓 관련 코드 */
const wsServer = require('socket.io')(server, {
    cors: {
        origin: '*' // Adjust this for production
    }
});
wsServer.on("connection", (socket) => {
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
        wsServer.emit('get_room_list', roomList); // 방리스트를 보내준다.
    }
    //방 인원수 조회
    function countRoom(roomName, isDisconnecting) {
        const room = wsServer.sockets.adapter.rooms.get(roomName);
        if (room) {
            const count = room.size;
            wsServer.to(roomName).emit('count_room', isDisconnecting ? count - 1 : count);
        }
        else {
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
        socket.emit('get_room_list', roomList); // 방리스트를 보내준다.
    });
    /* 방 입장시 */
    socket.on("enter_room", (roomName, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const roomList = getRoomList(); // 방리스트
        yield socket.join(roomName); // 방에 입장 및 생성
        if (!roomList.includes(roomName)) { // 새로운 방이 생성되면
            sendRoomList();
        }
        countRoom(roomName, false);
        callback(roomName); // front에서 실행됌
    }));
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
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", countRoom(room, true));
        });
    });
});
server.listen(port, () => console.log("hi23sssassdfdf"));
