import { useEffect, useState } from 'react';
import useLoginCheck from '../../hooks/useLoginCheck';
import io from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store/userStore';
import { Button, Input } from 'antd';
import useAxios, { Method } from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const navigate = useNavigate();
  useLoginCheck();
  const socket = io('http://localhost:8000');
  const userInfo = useRecoilValue(userInfoState);
  const [roomList, setRoomList] = useState([]);
  const [joinRoomInputValue, setJoinRoomInputValue] = useState('');

  useEffect(() => {
    if (userInfo) {
      socket.emit('init');
      socket.on('count_room', (roomCount) => {
        console.log(roomCount);
      });
      socket.on('get_room_list', (roomList) => {
        console.log('get_room_list');
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
    <div>
      <Input
        onChange={(e) => {
          setJoinRoomInputValue(e.target.value);
        }}
      />
      <Button onClick={joinRoom}>방입장</Button>
      <Button onClick={logout}>로그아웃</Button>
      {roomList.map((room, index) => (
        <div key={index}>{room}</div>
      ))}
    </div>
  );
};

export default HomePage;
