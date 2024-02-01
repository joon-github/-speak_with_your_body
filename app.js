const socket = io();

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
const welcomeForm = welcome.querySelector("form");
const myFace = document.getElementById("myFace");
const peers = document.getElementById("peers");

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnections = {};

call.hidden = true;

async function startMedia(deviceId) {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" }
    });
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.error('Failed to get media stream:', e);
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === "videoinput");
    cameras.forEach(camera => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.error('Failed to get cameras:', e);
  }
}

function makeConnection(peerSocketId) {
  if (myPeerConnections[peerSocketId]) {
    // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
    return;
  }

  myPeerConnections[peerSocketId] = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  });
  myPeerConnections[peerSocketId].addEventListener("icecandidate", event => {
    if (event.candidate) {
      socket.emit("ice", event.candidate, roomName, peerSocketId);
    }
  });
  myPeerConnections[peerSocketId].addEventListener("track", event => {
    if (!document.getElementById(peerSocketId)) {
      // 해당 peerSocketId에 대한 비디오 요소가 없을 경우에만 추가합니다.
      addVideoStream(event.streams[0], peerSocketId);
    }
  });
  myStream.getTracks().forEach(track => myPeerConnections[peerSocketId].addTrack(track, myStream));
}

function addVideoStream(stream, peerSocketId) {
  const peersVideo = document.createElement("video");
  peersVideo.srcObject = stream;
  peersVideo.autoplay = true;
  peersVideo.width = 400;
  peersVideo.height = 400;
  peersVideo.id = peerSocketId;
  peers.appendChild(peersVideo);
}

muteBtn.addEventListener("click", () => {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  muteBtn.innerText = muted ? "Unmute" : "Mute";
  muted = !muted;
});

cameraBtn.addEventListener("click", () => {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  cameraBtn.innerText = cameraOff ? "Camera On" : "Camera Off";
  cameraOff = !cameraOff;
});

camerasSelect.addEventListener("input", async () => {
  await startMedia(camerasSelect.value);
});

welcomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  roomName = welcomeForm.querySelector("input").value;
  await startMedia();
  socket.emit("join_room", roomName);
  call.hidden = false;
  welcome.hidden = true;
});

socket.on("welcome", async (peerSocketId) => {
  console.log(myPeerConnections);
  makeConnection(peerSocketId);
  const offer = await myPeerConnections[peerSocketId].createOffer();
  await myPeerConnections[peerSocketId].setLocalDescription(offer);
  socket.emit("offer", offer, roomName, peerSocketId);
});

socket.on("offer", async (offer, peerSocketId) => {
  console.log(myPeerConnections);
  makeConnection(peerSocketId);
  await myPeerConnections[peerSocketId].setRemoteDescription(offer);
  const answer = await myPeerConnections[peerSocketId].createAnswer();
  await myPeerConnections[peerSocketId].setLocalDescription(answer);
  socket.emit("answer", answer, roomName, peerSocketId);
});

socket.on("answer", (answer, peerSocketId) => {
  myPeerConnections[peerSocketId].setRemoteDescription(answer);
});

socket.on("ice", (ice, peerSocketId) => {
  myPeerConnections[peerSocketId].addIceCandidate(ice);
});

socket.on("leave", (peerSocketId) => {
  if (myPeerConnections[peerSocketId]) {
    myPeerConnections[peerSocketId].close();
    delete myPeerConnections[peerSocketId];
  }
  const video = document.getElementById(peerSocketId);
  if (video) video.remove();
});
