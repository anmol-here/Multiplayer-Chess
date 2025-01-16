import { Chess } from "chess.js";
import { messageType } from "./message";
import { BoardType } from "../pages/PlayOnline";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

interface PropType {
    socket: WebSocket,
    setColor: (color: 'w' | 'b') => void,
    chess: Chess,
    setBoard: (board: BoardType) => void,
    setLoading: (loading: boolean) => void
}

export const SocketController:React.FC<PropType> = ({socket , setColor , chess , setBoard , setLoading}) => {
    const navigate = useNavigate();

    useEffect(() => {


        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            console.log(message)

            if (message.type === messageType.COLOR) {
                console.log(message.color)
                setColor(message.color);
                setLoading(false);
                navigate("/play/online")
            }

            else if (message.type === messageType.MOVE) {
                console.log(message.move)
                try {
                    chess.move({ from: message.move.from, to: message.move.to })
                    setBoard(chess.board());
                    console.log(chess.board());

                } catch (error) {
                    console.log(error)
                }
            }
        }
    }, [chess, setBoard, setColor, setLoading, socket , navigate])
    
    return (
        null
    )

}