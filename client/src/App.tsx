import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import MainLayout from './components/layout/MainLayout';
function App() {
  const socket = io('http://localhost:8000');

  useEffect(() => {
    socket.emit('welcome');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<div>home22</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
