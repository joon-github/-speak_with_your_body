import { useEffect } from 'react'
import io from "socket.io-client";

function App() {
  const socket = io.connect("http://localhost:8000");
  useEffect(()=>{
    socket.emit("welcome");
  },[])
  return (
    <div className="App">
      hello world
    </div>
  );
}

export default App;
