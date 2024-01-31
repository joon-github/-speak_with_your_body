import { useEffect, useState } from 'react';
import { useSocket } from '../../components/provider/SocketProvider';
const useInRoom = () => {
  const socket = useSocket();
  const [userList, setUserList] = useState<string[]>([]);
  useEffect(() => {
    if (socket) {
      socket.emit('get_user_list');
      socket.on('get_user_list', (userList: string[]) => {
        setUserList(userList);
      });
    }
  }, [socket]);
  return { userList };
};

export default useInRoom;
