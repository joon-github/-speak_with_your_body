import express, { Express, Request, Response } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const app: Express = express();
const http = require('http');
const server = http.createServer(app);

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const indexRouter = require('../src/routes/index');
app.use('/test', indexRouter);


/* 웹소켓 관련 코드 */
const wsServer: SocketIOServer = require('socket.io')(server, {
  cors: {
    origin: '*' // Adjust this for production
  }
});

wsServer.on("connection", (socket: Socket) => {

  // 방리스트 조회 함수
  function getRoomList() {
    const adapter = wsServer.sockets.adapter;
    const newRoomList =
      [...adapter.rooms.keys()] // 모든 방 리스트에서
        .filter((room) => !adapter.sids.has(room))
    return newRoomList
  }

  // 방리스트 보내기
  function sendRoomList() {
    const roomList = getRoomList();
    wsServer.emit('get_room_list', roomList); // 방리스트를 보내준다.
  }

  //방 인원수 조회
  function countRoom(roomName: string, isDisconnecting: boolean) {
    const room = wsServer.sockets.adapter.rooms.get(roomName);
    if (room) {
      const count = room.size
      wsServer.to(roomName).emit('count_room', isDisconnecting ? count - 1 : count);
    } else {
      console.log(`Room ${roomName} doesn't exist.`);
    }
  }

  socket.onAny((event) => {
    // console.log(wsServer.sockets.adapter);
  })

  /* 최초 입장시 */
  socket.on("welcome", () => {
    const roomList = getRoomList();
    console.log(socket)
    socket.emit('get_room_list', roomList); // 방리스트를 보내준다.
  })

  /* 방 입장시 */
  socket.on("enter_room", async (roomName: string, callback) => {
    const roomList = getRoomList(); // 방리스트
    await socket.join(roomName) // 방에 입장 및 생성

    if (!roomList.includes(roomName)) { // 새로운 방이 생성되면
      sendRoomList();
    }
    countRoom(roomName, false);
    callback(roomName); // front에서 실행됌
  })

  /* 방 퇴장시 */
  socket.on("disconnect", () => {
    sendRoomList();
  })

  /* 메세지 */
  socket.on("to_server_message", (msg, room) => {
    wsServer.to(room).emit("to_client_message", msg); //방 전체 전송 (발신자 포함)
  })

  /* 서버 퇴장시 */
  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach(room => {
      socket.to(room).emit("bye", countRoom(room, true))
    });
  })


})
server.listen(8000, () => console.log("hi"));