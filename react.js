import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ room }) => {
    const userVideo = useRef();
    const peerVideos = useRef({});
    const socketRef = useRef();
    const peersRef = useRef([]);
    const [peers, setPeers] = useState([]);

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", room);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    });
                    peers.push(peer);
                });
                setPeers(peers);
            });

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                });

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        });
    }, [room]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ],
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.addStream(stream);

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer).then(() => {
                socketRef.current.emit("sending signal", { userToSignal, callerID, signal: peer.localDescription });
            });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ],
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.addStream(stream);
        peer.signal(incomingSignal);

        return peer;
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            socketRef.current.emit("sending ice candidate", { candidate: e.candidate, to: peerID });
        }
    }

    function handleTrackEvent(e) {
        if (!peerVideos.current[e.streams[0].id]) {
            peerVideos.current[e.streams[0].id] = e.streams[0];
        }
    }

    return (
        <div>
            <video playsInline muted ref={userVideo} autoPlay />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </div>
    );
};

const Video = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.ontrack = event => {
            ref.current.srcObject = event.streams[0];
        };
    }, []);

    return (
        <video playsInline ref={ref} autoPlay />
    );
};

export default VideoCall;


const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('join room', roomID => {
        socket.join(roomID);
        const otherUsers = io.sockets.adapter.rooms.get(roomID).filter(id => id !== socket.id);
        socket.emit("all users", Array.from(otherUsers));
    });

    socket.on('sending signal', payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning signal', payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('sending ice candidate', payload => {
        io.to(payload.to).emit('receiving ice candidate', { candidate: payload.candidate, id: socket.id });
    });
});