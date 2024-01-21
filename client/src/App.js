import { useEffect } from 'react'
import io from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import MainLayout from './components/layout/MainLayout';
function App() {
  const socket = io.connect("http://localhost:8000");
  useEffect(()=>{
    socket.emit("welcome");
  },[])
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path='/test' element={<div>test</div>} />
      </Route>
    </Routes>
  );
}

export default App;
