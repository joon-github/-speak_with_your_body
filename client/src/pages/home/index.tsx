import { useState } from 'react';
import { Button, Input, Spin } from 'antd';
import styled from 'styled-components';
import useLogoutMutation from '../../hooks/auth/useLogoutMutation';
import useRoomList from '../../hooks/socket/useRoomList';
import uuid from 'react-uuid';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
const HomePage = ({ socket }: { socket: Socket }) => {
  const navigate = useNavigate();

  const { mutate: logoutMutation, error } = useLogoutMutation();
  const { isLoading: socketConnected, roomList } = useRoomList(socket);

  const [joinRoomInputValue, setJoinRoomInputValue] = useState('');

  const createRoom = () => {
    const roomKey = uuid();
    socket?.emit('join_room', joinRoomInputValue, roomKey);
    navigate(`/room/${joinRoomInputValue}&${roomKey}`);
  };

  const logout = async () => {
    try {
      logoutMutation();
    } catch (e) {
      console.log(e);
    }
  };
  if (error) {
    throw error;
  }
  if (!socketConnected) return <Spin />;
  return (
    <HomePageContainer>
      <Input
        onChange={(e) => {
          setJoinRoomInputValue(e.target.value);
        }}
      />
      <Button onClick={createRoom}>방생성</Button>
      <Button onClick={logout}>로그아웃</Button>
      <RoomList>
        {roomList.map((room: string) => {
          const [roomName] = room.split('&');
          return (
            <Link to={`/room/${room}`} key={room}>
              <Room>
                <div className="title">
                  <span className="roomNumber">047</span>
                  <h3>{roomName}</h3>
                </div>
              </Room>
            </Link>
          );
        })}
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
