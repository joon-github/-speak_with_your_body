import { useState } from 'react';

import { Button, Input, Spin } from 'antd';
import styled from 'styled-components';

import useLogoutMutation from '../../hooks/auth/useLogoutMutation';
import useSockettSetting from '../../hooks/socket/useSocketSetting';

const HomePage = () => {
  const { mutate: logoutMutation } = useLogoutMutation();
  const [joinRoomInputValue, setJoinRoomInputValue] = useState('');
  const { isLoading: socketConnected, roomList, socket } = useSockettSetting();

  const joinRoom = () => {
    socket.emit('join_room', joinRoomInputValue);
  };

  const logout = async () => {
    try {
      logoutMutation();
    } catch (e) {
      console.log(e);
    }
  };

  if (!socketConnected) return <Spin />;
  return (
    <HomePageContainer>
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
