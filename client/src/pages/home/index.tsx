import { useEffect } from 'react';
import useLoginCheck from '../../hooks/useLoginCheck';
import io from 'socket.io-client';
const HomePage = () => {
  const socket = io('http://localhost:8000');

  useEffect(() => {
    socket.emit('welcome');
  }, []);
  useLoginCheck();
  return <div>test</div>;
};

export default HomePage;
