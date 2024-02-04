import { useEffect, useState } from 'react';
import useUserCheckQuery from '../auth/useUserCheckQuery';
import { Socket } from 'socket.io-client';
const useRoomList = (socket: Socket) => {
  const [socketConnected, SetSocketconnected] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const { data: userInfo } = useUserCheckQuery();
  useEffect(() => {
    if (socket && userInfo) {
      socket.emit('init', userInfo.data.name);
      socket.on('count_room', (roomCount) => {
        console.log(roomCount);
      });
      socket.on('get_room_list', (roomList) => {
        SetSocketconnected(true);
        setRoomList(roomList);
      });
    }
  }, [socket, userInfo]);

  return { isLoading: socketConnected, socket, roomList };
};

export default useRoomList;
