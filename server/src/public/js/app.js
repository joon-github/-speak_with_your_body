const socket = io();
socket.emit('welcome',()=>{
  console.log("test")
})

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");



room.hidden = true;
let roomNameStr
/* 함수 관련 */
function showRoom (roomName) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
  roomNameStr = roomName;
}

// 방 입장 함수
function onWelcomeSubmit(e) {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room",input.value , showRoom);
  input.value = "";
}

// 메세지 전송 함수
function onMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("input");
  socket.emit("to_server_message" ,input.value,roomNameStr);
  input.value = "";
}

//메세지 수신 함수
function message(msg){
  console.log(msg)
}


/* Evnet 관련 */

// 방 입장시
welcomeForm.addEventListener("submit", onWelcomeSubmit);

// 메세지 전송시
roomForm.addEventListener("submit", onMessageSubmit);


/* Socket 관련 */

// 방접속시 
socket.on("get_room_list", (roomList) => {
  console.log("방 리스트 : " , roomList);
})
socket.on("count_room", (count) => {
  console.log("방 인원수 : " , count);
})

// 메세지
socket.on("to_client_message", message);

// room list

