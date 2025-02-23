import { useEffect, useState } from 'react'
import { SocketController } from './utils/SocketController';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PlayOnline from './pages/PlayOnline';
import { Chess, Color } from 'chess.js';

const Backend_Url = import.meta.env.VITE_BACKEND_URL

const ws = new WebSocket(Backend_Url)

export interface ChatType{
  chat:string;
  didYouSend:boolean;
}

function App() {

  const [socket, setSocket] = useState<WebSocket>();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [color, setColor] = useState<Color>();
  const [loading, setLoading] = useState(false);
  const [timer , setTimer] = useState(600);
  const [opponentTimer , setOpponentTimer] = useState(600);
  const [chats , setChats] = useState<ChatType[]>([]);
  const [isWinner , setIsWinner] = useState<Color>();
  const [gameOverReason , setGameOverReason] = useState<string | undefined>();

  useEffect(() => {
    if (ws) {
      setSocket(ws);
    }
  }, [chess])

  if (socket) {

    return (
      <div className=' bg-[#302E2B] w-screen min-h-screen flex items-center justify-center flex-col font-poppins'>
      <BrowserRouter>
        <SocketController socket={ws} setTimer = {setTimer} setOpponentTimer={setOpponentTimer} setColor={setColor} chess={chess} setBoard={setBoard} setLoading={setLoading} setChats={setChats} setIsWinner={setIsWinner} setGameOverReason={setGameOverReason} />
        <Routes>
          <Route path='/' element={<Home socket={socket} loading={loading} setLoading={setLoading} />} />
          <Route path='/play/online' element={<PlayOnline socket={socket} board={board} setBoard={setBoard} chess={chess} color={color} timer={timer} opponentTimer={opponentTimer} chats={chats} setChats={setChats} isWinner={isWinner} gameOverReason={gameOverReason} />} />
        </Routes>
      </BrowserRouter>
      </div>
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
