//React와 필요한 훅, 컴포넌트를 임포트합니다.
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
// TypeScript 인터페이스 정의: 비디오 장치에 대한 정보를 저장합니다.
interface ICamera {
  deviceId: string;
  label: string;
}
const RoomPage = ({ socket }: { socket: Socket }) => {
  // 상태와 레퍼런스 훅을 사용해 필요한 데이터를 저장합니다.
  const { roomkey } = useParams();
  const myStream = useRef<MediaStream>(new MediaStream());
  const [muted, setMuted] = useState<boolean>(false);
  const [cameraOff, setCameraOff] = useState<boolean>(false);
  const [cameras, setCameras] = useState<ICamera[]>([]);
  const myPeerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const myFace = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    startMedia();
    socket.emit('start', roomkey);
    socket?.on('welcome', async (peerSocketId: string) => {
      console.log('=========welcome 진입=============');
      if (myPeerConnections.current[peerSocketId]) {
        return; // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
      }
      try {
        await makeConnection(peerSocketId);
        const offer =
          await myPeerConnections.current[peerSocketId].createOffer();
        await myPeerConnections.current[peerSocketId].setLocalDescription(
          offer,
        );
        socket?.emit('offer', offer, peerSocketId);
      } catch (error) {
        console.error('welcome setLocalDescription 실패', error);
      }
      console.log('=========welcome 나감=============');
    });

    socket?.on(
      'offer',
      async (offer: RTCSessionDescriptionInit, peerSocketId: string) => {
        console.log('=========offer 진입=============');
        // try {
        await makeConnection(peerSocketId);
        await myPeerConnections.current[peerSocketId].setRemoteDescription(
          offer,
        );
        const answer =
          await myPeerConnections.current[peerSocketId].createAnswer();

        await myPeerConnections.current[peerSocketId].setLocalDescription(
          answer,
        );
        addQueuedIceCandidates(peerSocketId);
        console.log('=========offer 나감=============');

        socket?.emit('answer', answer, peerSocketId); // Send the answer back to the offering peer
        // } catch (error) {
        //   console.error('offer 에러:', error);
        // }
      },
    );

    socket?.on(
      'answer',
      async (answer: RTCSessionDescriptionInit, peerSocketId: string) => {
        console.log('==============answer 진입=============');
        const pc = myPeerConnections.current[peerSocketId];
        if (!pc) {
          console.error('연결된 커넥션이 없음.', peerSocketId);
          return;
        }

        console.log(`현재 연결 상황 ${peerSocketId}:`, pc.signalingState);

        // Proceed only if the signaling state indicates that the connection is expecting an answer
        if (pc.signalingState === 'have-local-offer') {
          try {
            console.log(pc.signalingState, ': 에서 연결 시도');
            await pc.setRemoteDescription(answer);
            console.log(
              `Remote description set 성공!, 새로운 상태: ${pc.signalingState}`,
            );
          } catch (error) {
            console.error('에러, setRemoteDescription가 실패했다....:', error);
          }
        } else {
          console.warn('이미 연결된 상태.. 현재상태 :', pc.signalingState);
          // Consider adding logic here to handle unexpected answers, such as renegotiation logic if needed
        }
        console.log('==============answer 나감=============');
      },
    );

    const iceCandidatesQueue: RTCIceCandidateInit[] = [];
    const addQueuedIceCandidates = (peerSocketId: string) => {
      const pc = myPeerConnections.current[peerSocketId];
      if (pc) {
        iceCandidatesQueue.forEach((ice) => pc.addIceCandidate(ice));
        iceCandidatesQueue.length = 0; // 큐 비우기
      }
    };
    socket?.on('ice', (ice: RTCIceCandidateInit, peerSocketId: string) => {
      console.log('');
      console.log('==============ice 진입=============');
      console.log('PeerConnection:', myPeerConnections.current[peerSocketId]);
      const pc = myPeerConnections.current[peerSocketId];
      if (pc && pc.remoteDescription) {
        // 원격 설명이 설정되었다면 ICE 후보를 즉시 추가
        pc.addIceCandidate(ice);
      } else {
        // 원격 설명이 설정되지 않았다면 후보를 큐에 저장
        iceCandidatesQueue.push(ice);
      }
      console.log('==============ice 나감=============');
    });

    socket?.on('leave', (peerSocketId: string) => {
      if (myPeerConnections.current[peerSocketId]) {
        myPeerConnections.current[peerSocketId].close();
        delete myPeerConnections.current[peerSocketId];
      }
      const video = document.getElementById(peerSocketId);
      if (video) video.remove();
    });
  }, []);

  // 미디어 스트림을 시작하는 함수입니다.
  const startMedia = async (deviceId?: string) => {
    console.log('=========startMedia 진입=============');
    // try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: 'user' },
    });
    if (myFace.current) myFace.current.srcObject = stream;
    myStream.current = stream;
    if (!deviceId) {
      await getCameras();
    }
    console.log('==============startMedia 나감=============');
  };

  // 사용 가능한 카메라 장치를 검색하는 함수입니다.
  const getCameras = async () => {
    console.log('=========getCameras 진입=============');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices
      .filter((device) => device.kind === 'videoinput')
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label,
      }));
    setCameras(cameras);

    console.log('==============getCameras 나감=============');
  };

  // RTCPeerConnection을 생성하고 이벤트 리스너를 추가하는 함수입니다.
  const makeConnection = async (peerSocketId: string) => {
    console.log('=========makeConnection 진입=============');

    if (myPeerConnections.current[peerSocketId]) {
      console.log('makeConnection', peerSocketId, myPeerConnections);
      return; // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
    }

    myPeerConnections.current[peerSocketId] = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    console.log('connection created:', myPeerConnections.current[peerSocketId]);

    myPeerConnections.current[peerSocketId].addEventListener(
      'icecandidate',
      (event) => {
        console.log('=========icecandidate 진입=============');
        if (event.candidate) {
          socket?.emit('ice', event.candidate, peerSocketId);
        }
        console.log('==============icecandidate 나감=============');
      },
    );

    myPeerConnections.current[peerSocketId].addEventListener(
      'track',
      (event) => {
        console.log('=========track 진입=============');
        if (!document.getElementById(peerSocketId)) {
          console.log('연결성공!');
          addVideoStream(event.streams[0], peerSocketId);
        }
        console.log('==============track 나감=============');
      },
    );

    await startMedia();
    if (myStream.current) {
      myStream.current
        .getTracks()
        .forEach((track) =>
          myPeerConnections.current[peerSocketId].addTrack(
            track,
            myStream.current,
          ),
        );
    } else {
      console.error('Stream error');
    }
    console.log('==============makeConnection 나감=============');
  };

  // 비디오 스트림을 DOM에 추가하는 함수입니다.
  const addVideoStream = (stream: MediaStream, peerSocketId: string) => {
    console.log('addVideoStream');
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.width = 400;
    video.height = 400;
    video.id = peerSocketId;
    peersRef.current?.appendChild(video);
  };

  const test = () => {
    console.log(myPeerConnections.current);
  };

  //이벤트 핸들러 및 JSX를 포함한 렌더링 부분입니다.
  return (
    <div>
      <Link to="/">방리스트</Link>
      <button onClick={test}>test</button>
      <div id="call">
        <video ref={myFace} autoPlay playsInline></video>
        <h1>zzz</h1>
        <button
          onClick={() => {
            const isMuted = !muted;
            setMuted(isMuted);
            // myStream
            myStream.current
              ?.getAudioTracks()
              .forEach((track) => (track.enabled = !isMuted));
          }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button
          onClick={() => {
            const isCameraOff = !cameraOff;
            setCameraOff(isCameraOff);
            // myStream
            myStream.current
              ?.getVideoTracks()
              .forEach((track) => (track.enabled = !isCameraOff));
          }}
        >
          {cameraOff ? 'Camera On' : 'Camera Off'}
        </button>
        <select
          onChange={async (event) => {
            await startMedia(event.target.value);
          }}
        >
          {cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label}
            </option>
          ))}
        </select>
      </div>
      <div ref={peersRef} id="peers"></div>
    </div>
  );
};

export default RoomPage;
