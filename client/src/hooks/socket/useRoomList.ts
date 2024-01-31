import { useEffect, useState } from 'react';
import { useSocket } from '../../components/provider/SocketProvider';
const useRoomList = () => {
  const socket = useSocket();
  const [socketConnected, SetSocketconnected] = useState(false);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit('init');
      socket.on('count_room', (roomCount) => {
        console.log(roomCount);
      });
      socket.on('get_room_list', (roomList) => {
        SetSocketconnected(true);
        setRoomList(roomList);
      });
    }
  }, [socket]);

  return { isLoading: socketConnected, socket, roomList };
};

export default useRoomList;
