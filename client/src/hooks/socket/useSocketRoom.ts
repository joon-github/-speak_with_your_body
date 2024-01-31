import { useEffect, useState } from 'react';
import useUserCheckQuery from '../auth/useUserCheckQuery';
import io from 'socket.io-client';

const useSockettSetting = () => {
  const socket = io('http://localhost:8000');
  const [socketConnected, SetSocketconnected] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const { data: userInfo, error } = useUserCheckQuery();
  if (error) {
    throw error;
  }

  useEffect(() => {
    if (userInfo) {
      socket.emit('init');
      socket.on('count_room', (roomCount) => {
        console.log(roomCount);
      });
      socket.on('get_room_list', (roomList) => {
        SetSocketconnected(true);
        setRoomList(roomList);
      });
    }
  }, [userInfo]);

  return { isLoading: socketConnected, socket, roomList };
};

export default useSockettSetting;
