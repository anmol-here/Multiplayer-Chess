import { Chess, Color } from "chess.js";
import { messageType } from "./message";
import { BoardType } from "../pages/PlayOnline";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { ChatType } from "../App";

interface PropType {
    socket: WebSocket,
    setColor: (color: 'w' | 'b') => void,
    chess: Chess,
    setBoard: (board: BoardType) => void,
    setLoading: (loading: boolean) => void
    setTimer: (timer: number) => void
    setOpponentTimer: (timer: number) => void;
    setIsWinner:(isWinner:Color) => void;
    setGameOverReason:(reason:string) => void;
    setChats: (chats: ChatType[] | ((prev: ChatType[]) => ChatType[])) => void;}

export const SocketController: React.FC<PropType> = ({ socket, setColor, chess, setBoard, setLoading, setTimer, setOpponentTimer, setChats , setIsWinner , setGameOverReason }) => {
    const navigate = useNavigate();

    useEffect(() => {
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            console.log(message);

            if (message.type === messageType.COLOR) {
                console.log(message.color);
                setColor(message.color);
                setLoading(false);
                navigate("/play/online");
            } 
            else if (message.type === messageType.MOVE) {
                console.log(message.move);
                try {
                    chess.move({ from: message.move.from, to: message.move.to });
                    setBoard(chess.board());
                    console.log(chess.board());
                } catch (error) {
                    console.log(error);
                }
            } 
            else if (message.type === messageType.TIMER) {
                setTimer(message.timer);
            } 
            else if (message.type === messageType.OPPONENT_TIMER) {
                setOpponentTimer(message.timer);
            }
            else if(message.type === messageType.CHAT){
                const chat: ChatType = { chat: message.chat as string, didYouSend: false };
                console.log(chat);
                setChats((prev:ChatType[]) => [...prev, chat]);
            }
            else if(message.type === messageType.GAME_OVER){
                setIsWinner(message.payload.winner);
                setGameOverReason(message.reason);
            }
        };

        return () => {
            socket.onmessage = null;
        };
    }, [socket, chess, setBoard, setColor, setLoading, setTimer, setOpponentTimer, navigate]);

    return null;
};
