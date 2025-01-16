import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { messageType } from "../utils/message";

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
    color: Color
}

const PlayOnline: React.FC<PropType> = ({ socket, board, setBoard, chess, color }) => {
    const [from, setFrom] = useState<Square | null>(null);  // Make sure "from" is of type Square
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);  // Use Square[] for possible moves

    const handleSquareClick = (row: number, col: number) => {
        const square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;  // Ensure this is of type Square

        if (!from) {
            // First click to select a piece
            if (board[row][col] != null && board[row][col]!.color === color) {
                setFrom(square);
                highlightPossibleMoves(square);  // Pass valid Square type
            }
        } else if (board[row][col] != null && board[row][col]!.color === color) {
            // Change selected piece if clicking on another valid piece of the same color
            setFrom(square);
            highlightPossibleMoves(square);
        } else {
            // Try to move the selected piece to the clicked square
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
                setPossibleMoves([]);  // Clear possible moves after the move
            } catch (error) {
                setFrom(null);
                setPossibleMoves([]);  // Clear possible moves on error
                console.log(error);
            }
        }
    };

    // Highlight the possible moves for the selected piece
    const highlightPossibleMoves = (square: Square) => {
        const moves = chess.moves({ square, verbose: true });
        const moveSquares = moves.map(move => move.to as Square);  // Ensure we cast the move.to as Square
        setPossibleMoves(moveSquares);  // Update possible moves
    };

    return (
        <div className="">
            <div className="w-[700px]">
                <div className="w-full flex justify-between p-4 text-xl">
                    <p>Opponent</p>
                    <p className="font-semibold text-2xl">10:00</p>
                </div>
                <div className={`flex ${color === 'w' ? 'flex-col' : 'flex-col-reverse'}`}>
                    {board.map((row, i) => (
                        <div key={i} className="flex">
                            {row.map((square, j) => {
                                const squareName = `${String.fromCharCode(97 + j)}${8 - i}` as Square;  // Cast to Square type
                                return (
                                    <div
                                        onClick={() => handleSquareClick(i, j)}
                                        key={j}
                                        className={`
                                            ${(from && square?.square === from) ? 'bg-gray-200' : ''}
                                            ${(possibleMoves.includes(squareName)) ? '' : ''}
                                            ${(i + j) % 2 === 0 ? 'bg-[#789956]' : 'bg-[#e1e3c9]'}
                                            w-24 h-24 flex items-center justify-center text-3xl font-semibold text-black
                                        `}
                                    >
                                        <img className=" relative z-10" src={`/${square?.color}${square?.type}.png`} alt="" />
                                        {possibleMoves.includes(squareName) && (
                                            <div className=" absolute z-0">X</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="w-full flex justify-between p-4 text-xl">
                    <p>Opponent</p>
                    <p className="font-semibold text-2xl">10:00</p>
                </div>
            </div>
        </div>
    );
};

export default PlayOnline;
