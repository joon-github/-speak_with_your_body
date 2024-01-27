import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import io from 'socket.io-client';
import MainLayout from './components/layout/MainLayout';

const LoginPage = React.lazy(() => import('./pages/login'));
function App() {
  // const socket = io('http://localhost:8000');

  // useEffect(() => {
  //   socket.emit('welcome');
  // }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>home22</div>} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
