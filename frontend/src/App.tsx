import { useEffect, useState } from 'react'
import './App.css'
import { SocketController } from './utils/SocketController';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PlayOnline from './pages/PlayOnline';
import { Chess, Color } from 'chess.js';

const Backend_Url = import.meta.env.VITE_BACKEND_URL

const ws = new WebSocket(Backend_Url)

function App() {

  const [socket, setSocket] = useState<WebSocket>();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [color, setColor] = useState<Color>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ws) {
      setSocket(ws);
    }
  }, [chess])

  if (socket) {

    return (
      <BrowserRouter>
        <SocketController socket={ws} setColor={setColor} chess={chess} setBoard={setBoard} setLoading={setLoading} />
        <Routes>
          <Route path='/' element={<Home socket={socket} loading={loading} setLoading={setLoading} />} />
          <Route path='/play/online' element={<PlayOnline socket={socket} board={board} setBoard={setBoard} chess={chess} color={color} />} />
        </Routes>
      </BrowserRouter>
    )

  }
  else {
    return (
      <>
        Error while connecting
      </>
    )
  }
}

export default App
