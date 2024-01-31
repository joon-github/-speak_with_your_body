import { useLocation } from 'react-router-dom';

const Room = () => {
  const location = useLocation();
  const roomName = location.state;

  return <div>{roomName}</div>;
};

export default Room;
