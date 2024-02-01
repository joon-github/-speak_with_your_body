//React와 필요한 훅, 컴포넌트를 임포트합니다.
import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../components/provider/SocketProvider';
import { Link, useParams } from 'react-router-dom';

// TypeScript 인터페이스 정의: 비디오 장치에 대한 정보를 저장합니다.
interface ICamera {
  deviceId: string;
  label: string;
}
const RoomPage: React.FC = () => {
  // 상태와 레퍼런스 훅을 사용해 필요한 데이터를 저장합니다.
  const { roomkey } = useParams();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [cameraOff, setCameraOff] = useState<boolean>(false);
  const [cameras, setCameras] = useState<ICamera[]>([]);
  const myPeerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const myFace = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const answerHandled = useRef<{ [key: string]: boolean }>({});

  // 컴포넌트 마운트 시 미디어 스트림과 소켓 이벤트 리스너를 설정합니다.
  useEffect(() => {
    if (socket) {
      startMedia();
      socket?.emit('start', roomkey);
      socket?.on('welcome', async (peerSocketId: string) => {
        if (myPeerConnections.current[peerSocketId]) {
          return; // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
        }
        makeConnection(peerSocketId);
        const offer =
          await myPeerConnections.current[peerSocketId].createOffer();
        await myPeerConnections.current[peerSocketId].setLocalDescription(
          offer,
        );
        socket?.emit('offer', offer, peerSocketId);
      });

      socket?.on(
        'offer',
        async (offer: RTCSessionDescriptionInit, peerSocketId: string) => {
          console.log('offer');
          if (myPeerConnections.current[peerSocketId]) {
            return; // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
          }
          makeConnection(peerSocketId);
          await myPeerConnections.current[peerSocketId].setRemoteDescription(
            new RTCSessionDescription(offer),
          );
          const answer =
            await myPeerConnections.current[peerSocketId].createAnswer();
          await myPeerConnections.current[peerSocketId].setLocalDescription(
            answer,
          );
          socket?.emit('answer', answer, peerSocketId);
        },
      );

      socket?.on(
        'answer',
        async (answer: RTCSessionDescriptionInit, peerSocketId: string) => {
          console.log(
            `answer received for ${peerSocketId}: ${new Date().toISOString()}`,
          );
          const pc = myPeerConnections.current[peerSocketId];
          if (!pc || answerHandled.current[peerSocketId]) {
            console.warn(`Answer handling skipped for ${peerSocketId}`);
            return;
          }

          // 'have-local-offer' 상태에서만 answer 처리를 진행합니다.
          if (pc.signalingState === 'have-local-offer') {
            console.log(
              `Processing answer for ${peerSocketId}: ${pc.signalingState}`,
            );
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              console.log(
                `setRemoteDescription (answer) succeeded for ${peerSocketId}`,
              );
              answerHandled.current[peerSocketId] = true;
            } catch (error) {
              console.error(
                `Failed to set remote description for ${peerSocketId}:`,
                error,
              );
            }
          } else {
            console.warn(
              `Incorrect signaling state for ${peerSocketId}: ${pc.signalingState}`,
            );
          }
        },
      );

      socket?.on('ice', (ice: RTCIceCandidateInit, peerSocketId: string) => {
        console.log('ice');
        myPeerConnections.current[peerSocketId].addIceCandidate(
          new RTCIceCandidate(ice),
        );
      });

      socket?.on('leave', (peerSocketId: string) => {
        if (myPeerConnections.current[peerSocketId]) {
          myPeerConnections.current[peerSocketId].close();
          delete myPeerConnections.current[peerSocketId];
        }
        const video = document.getElementById(peerSocketId);
        if (video) video.remove();
      });
    }
  }, [socket]);

  // 미디어 스트림을 시작하는 함수입니다.
  const startMedia = async (deviceId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'user' },
      });
      if (myFace.current) myFace.current.srcObject = stream;
      setMyStream(stream);
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.error('Failed to get media stream:', e);
    }
  };

  // 사용 가능한 카메라 장치를 검색하는 함수입니다.
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label,
        }));
      setCameras(cameras);
    } catch (e) {
      console.error('Failed to get cameras:', e);
    }
  };

  // RTCPeerConnection을 생성하고 이벤트 리스너를 추가하는 함수입니다.
  const makeConnection = (peerSocketId: string) => {
    if (myPeerConnections.current[peerSocketId]) {
      console.log('makeConnection', peerSocketId, myPeerConnections);
      return; // 이미 연결이 존재하는 경우, 새 연결을 만들지 않습니다.
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        socket?.emit('ice', event.candidate, peerSocketId);
      }
    });

    pc.addEventListener('track', (event) => {
      if (!document.getElementById(peerSocketId)) {
        addVideoStream(event.streams[0], peerSocketId);
      }
    });

    myStream?.getTracks().forEach((track) => pc.addTrack(track, myStream));
    myPeerConnections.current[peerSocketId] = pc;
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
    const h1 = document.createElement('h1');
    h1.innerText = 'test';
    peersRef.current?.appendChild(h1);
  };

  //이벤트 핸들러 및 JSX를 포함한 렌더링 부분입니다.
  return (
    <div>
      <Link to="/">방리스트</Link>
      <button onClick={test}>test</button>
      <div id="call">
        <video ref={myFace} autoPlay playsInline></video>
        <h1>zzz</h1>
        <div ref={peersRef} id="peers"></div>
        <button
          onClick={() => {
            const isMuted = !muted;
            setMuted(isMuted);
            myStream
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
            myStream
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
    </div>
  );
};

export default RoomPage;
