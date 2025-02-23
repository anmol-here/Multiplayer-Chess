import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { messageType } from "../utils/message";
import { ChatType } from "../App";
import GameOver from "./GameOver";

interface SquareType {
    square: Square,
    type: PieceSymbol,
    color: Color
}

export type BoardType = (SquareType | null)[][];

interface PropType {
    socket: WebSocket,
    board: BoardType,
    setBoard: (sqaure: BoardType) => void,
    chess: Chess,
    color: Color | undefined,
    timer:number;
    opponentTimer:number;
    chats:ChatType[];
    setChats:(chats: ChatType[] | ((prev: ChatType[]) => ChatType[])) => void;
    isWinner:Color | undefined;
    gameOverReason:string | undefined;
}

const PlayOnline: React.FC<PropType> = ({ socket, board, setBoard, chess, color,timer , opponentTimer, chats , setChats , isWinner , gameOverReason  }) => {
    const [from, setFrom] = useState<Square | null>(null); 
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
    const [message , setMessage] = useState<string>("");

    const handleSquareClick = (row: number, col: number) => {
        const square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;

        if (!from) {
            if (board[row][col] != null && board[row][col]!.color === color) {
                setFrom(square);
                highlightPossibleMoves(square);
            }
        } else if (board[row][col] != null && board[row][col]!.color === color) {

            setFrom(square);
            highlightPossibleMoves(square);
        } else {

            try {
                chess.move({ from, to: square, promotion: 'q' });
                setBoard(chess.board());
                socket.send(JSON.stringify({
                    type: messageType.MOVE,
                    move: {
                        from,
                        to: square
                    }
                }));
                setFrom(null);
                setPossibleMoves([]);
            } catch (error) {
                setFrom(null);
                setPossibleMoves([]); 
                console.log(error);
            }
        }
    };

    const highlightPossibleMoves = (square: Square) => {
        const moves = chess.moves({ square, verbose: true });
        const moveSquares = moves.map(move => move.to as Square);
        setPossibleMoves(moveSquares);  // Update possible moves
    };

    function formatTime(timer: number) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const sendChat = (e:any) => {
        e.preventDefault();
        const chat:ChatType = {chat:message , didYouSend:true};
        setChats((prev:ChatType[]) => [...prev , chat]);
        socket.send(JSON.stringify({
            type: messageType.CHAT,
            chat: message
        }));
    }


    return (
        <div className=" h-full flex flex-col lg:flex-row items-center justify-center gap-10 bg-[#302E2B] font-poppins z-0">
            {isWinner && gameOverReason && <GameOver isWinner={isWinner} reason={gameOverReason} color = {color}  /> }
            <div className=" h-full">
                <div className="w-full flex justify-between p-4 text-xl">
                    <p className="text-white text-2xl font-semibold">Opponent</p>
                    <p className="font-semibold text-2xl bg-white text-black w-20 text-center">{formatTime(opponentTimer)}</p>
                </div>
                <div className={`flex ${color === 'w' ? 'flex-col' : 'flex-col-reverse'}`}>
                    {board.map((row, i) => (
                        <div key={i} className="flex z-0">
                            {row.map((square, j) => {
                                const squareName = `${String.fromCharCode(97 + j)}${8 - i}` as Square;  // Cast to Square type
                                return (
                                    <div
                                        onClick={() => handleSquareClick(i, j)}
                                        key={j}
                                        className={`
                                            ${(from && square?.square === from) ? 'bg-gray-200' : ''}
                                            ${(possibleMoves.includes(squareName)) ? ' shadow' : ''}
                                            ${(i + j) % 2 === 0 ? 'bg-[#789956]' : 'bg-[#e1e3c9]'}
                                            w-[40px] h-[40px] sm:w-[70px] sm:h-[70px] flex items-center justify-center text-3xl font-semibold text-black
                                        `}
                                    >
                                        {square?.color && square?.type && (
                                            <img className="relative z-10" src={`/${square.color}${square.type}.png`} alt="" />
                                        )}
                                        {possibleMoves.includes(squareName) && (
                                            <div className=" absolute z-0"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="w-full flex justify-between p-4 text-xl">
                    <p className="text-white text-2xl font-semibold">You</p>
                    <p className="font-semibold text-2xl bg-white text-black w-20 text-center">{formatTime(timer)}</p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-sm w-full h-full">
                <div className=" bg-white w-full h-[200px] lg:h-[400px] p-4 rounded-md flex flex-col gap-2 overflow-y-scroll scrollbar">
                    {
                        chats && chats.length > 0 && chats.map((chat , i) => (
                            <div key={i} className={`w-full p-2 ${chat.didYouSend ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-black self-start'} rounded-md`}>
                                {chat.chat}
                            </div>
                        ))
                    }
                </div>
                <form className="flex flex-col items-center gap-2 w-full" onSubmit={sendChat}>
                    <textarea placeholder="Enter message" required onChange={(e)=>{setMessage(e.target.value)}} className=" w-full rounded-md focus:outline-none p-2"></textarea>
                    <button type="submit" className=" bg-blue-600 p-2 rounded-md w-full text-white">Send Chat</button>
                </form>
            </div>
        </div>
    );
};

export default PlayOnline;
