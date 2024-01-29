import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { Button, Input, Spin } from 'antd';
import styled from 'styled-components';

import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store/userStore';

import useAxios, { Method } from '../../hooks/useAxios';
import useLoginCheck from '../../hooks/useLoginCheck';

const HomePage = () => {
  const socket = io('http://localhost:8000');
  const navigate = useNavigate();
  useLoginCheck();
  const userInfo = useRecoilValue(userInfoState);
  const [roomList, setRoomList] = useState([]);
  const [joinRoomInputValue, setJoinRoomInputValue] = useState('');
  const [socketConnected, SetSocketconnected] = useState(false);

  useEffect(() => {
    if (socket?.connect()) {
      SetSocketconnected(socket?.connect().connected);
    }
  }, [socket]);

  useEffect(() => {
    if (userInfo) {
      socket.emit('init');
      socket.on('count_room', (roomCount) => {
        console.log(roomCount);
      });
      socket.on('get_room_list', (roomList) => {
        setRoomList(roomList);
      });
    }
  }, [userInfo]);

  const joinRoom = () => {
    console.log('join_room');
    socket.emit('join_room', joinRoomInputValue);
  };

  const logout = async () => {
    try {
      await useAxios({
        method: Method.POST,
        url: '/auth/logout',
      });
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <HomePageContainer>
      {socketConnected ? (
        <>
          <Input
            onChange={(e) => {
              setJoinRoomInputValue(e.target.value);
            }}
          />
          <Button onClick={joinRoom}>방입장</Button>
          <Button onClick={logout}>로그아웃</Button>
          <RoomList>
            {roomList.map((room, index) => (
              <Room key={index}>
                <div className="title">
                  <span className="roomNumber">047</span>
                  <h3>{room}</h3>
                </div>
              </Room>
            ))}
          </RoomList>
        </>
      ) : (
        <Spin />
      )}
    </HomePageContainer>
  );
};

export default HomePage;

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const RoomList = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: red;
  flex: 1;
`;

const Room = styled.article`
  width: 300px;
  height: 200px;
  background-color: green;
  .title {
    display: flex;
    align-items: center;
    background-color: gray;
    .roomNumber {
      border: 1px solid black;
      width: 50px;
    }
    h3 {
      margin: 0;
    }
  }
`;
