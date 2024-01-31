import { Server as SocketIOServer } from "socket.io";

const initializeWebSocket = (server: any) => {
  const wsServer: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*", // Adjust this for production
    },
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
      console.log("send_room_list");
      const roomList = getRoomList();
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
    socket.on("init", () => {
      console.log("init");
      sendRoomList();
    });

    socket.on("join_room", (roomName) => {
      // console.log(roomName);
      socket.join(roomName);

      // socket.to(roomName).emit("welcome", socket.id);
      countRoom(roomName, false);
      const roomList = getRoomList();
      if (!roomList.includes(roomName)) {
      sendRoomList();
      }
      socket.on("disconnect", () => {
        socket.to(roomName).emit("leave", socket.id);
      });
    });

    socket.on("offer", (offer, roomName, peerSocketId) => {
      socket.to(peerSocketId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, roomName, peerSocketId) => {
      socket.to(peerSocketId).emit("answer", answer, socket.id);
    });

    socket.on("ice", (ice, roomName, peerSocketId) => {
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
