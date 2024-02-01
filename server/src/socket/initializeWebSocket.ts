import { Server as SocketIOServer } from "socket.io";
import { Server, Socket } from "socket.io";
const initializeWebSocket = (server: Server) => {
  const wsServer: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*", // Adjust this for production
    },
  });
  wsServer.on("connection", (socket: Socket) => {
    socket.onAny((event) => {
      // console.log(event, wsServer.sockets.adapter);
    });

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
      console.log(roomList);
      wsServer.emit("get_room_list", roomList); // 방리스트를 보내준다.
    }

    //방 인원수 조회
    function countRoom(roomName: string, isDisconnecting: boolean) {
      const room = wsServer.sockets.adapter.rooms.get(roomName);
      if (room) {
        const count = room.size;
        socket
          .to(roomName)
          .emit("count_room", isDisconnecting ? count - 1 : count);
      } else {
        console.log(`Room ${roomName} doesn't exist.`);
      }
    }
    //최초 입장시
    socket.on("init", (name) => {
      socket.name = name;
      sendRoomList();
    });
    // 방 생성 및 입장
    socket.on("join_room", (roomName, key) => {
      const roomList = getRoomList();
      socket.join(`${roomName}&${key}`);
      // countRoom(roomName, false);
      if (!roomList.includes(String(roomName))) {
        sendRoomList();
      }
      socket.on("disconnect", () => {
        socket.to(roomName).emit("leave", socket.id);
      });
    });
    // 방 입장 후 유저 정보 요청
    socket.on("start", (roomName) => {
      console.log("start", roomName, socket.id);
      socket.to(roomName).emit("welcome", socket.id);
    });

    socket.on("offer", (offer, peerSocketId) => {
      console.log("offer", peerSocketId);
      socket.to(peerSocketId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, peerSocketId) => {
      console.log("answer", peerSocketId);
      socket.to(peerSocketId).emit("answer", answer, socket.id);
    });

    socket.on("ice", (ice, peerSocketId) => {
      console.log("ice", peerSocketId);
      socket.to(peerSocketId).emit("ice", ice, socket.id);
    });

    /* 서버 퇴장시 */
    socket.on("disconnecting", (reason) => {
      socket.rooms.forEach((room) => {
        socket.to(room).emit("bye", countRoom(room, true));
      });
    });
  });
};

export default initializeWebSocket;
