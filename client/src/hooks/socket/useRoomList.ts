import { useEffect, useState } from 'react';
import { useSocket } from '../../components/provider/SocketProvider';
import useUserCheckQuery from '../auth/useUserCheckQuery';
const useRoomList = () => {
  const socket = useSocket();
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
        console.log(roomList);
        setRoomList(roomList);
      });
    }
  }, [socket, userInfo]);

  return { isLoading: socketConnected, socket, roomList };
};

export default useRoomList;
