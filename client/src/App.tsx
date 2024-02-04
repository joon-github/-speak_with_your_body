import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home';
import RoomPage from './pages/room';
import LoginPage from './pages/login';

import { io } from 'socket.io-client';

function App() {
  const socket = io('http://localhost:8000');
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/room/:roomkey" element={<RoomPage socket={socket} />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
