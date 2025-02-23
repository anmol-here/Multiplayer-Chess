import {Chess} from "chess.js"
import { messageType } from "./message";

export class Game {
    Player1: WebSocket;
    Player2: WebSocket;
    player1Time: number;
    player2Time: number;
    private chess: Chess;
    private movesCount: number;
    chats:Map<WebSocket , string>;


    constructor(player1: WebSocket, player2: WebSocket) {
        this.Player1 = player1;
        this.Player2 = player2;
        this.player1Time = 600;
        this.player2Time = 600;
        this.chess = new Chess();
        this.movesCount = 0;
        this.chats = new Map<WebSocket , string>();

        console.log("Initializing the game")

        player1.send(JSON.stringify({type: messageType.COLOR , color:'w'}))
        player2.send(JSON.stringify({type: messageType.COLOR , color:'b'}))

        setInterval(() => {
            if (this.movesCount % 2 === 0) {
                if(this.player1Time <= 0) {
                    this.Player1.send(JSON.stringify({
                        type: messageType.GAME_OVER,
                        reason:messageType.TIME_OUT,
                        payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
                    }));
                    this.Player2.send(JSON.stringify({
                        type: messageType.GAME_OVER,
                        reason:messageType.TIME_OUT,
                        payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
                    }));
                }
                else{
                    this.player1Time--;
                    this.Player1.send(JSON.stringify({type: messageType.TIMER , timer:this.player1Time}))
                    this.Player2.send(JSON.stringify({type: messageType.OPPONENT_TIMER , timer:this.player1Time}))
                }
            }
            else {
                if(this.player2Time <= 0) {
                    this.Player1.send(JSON.stringify({
                        type: 'timeout',
                        payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
                    }));
                    this.Player2.send(JSON.stringify({
                        type: 'timeout',
                        payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
                    }));
                }
                else{
                    this.player2Time--;
                    this.Player2.send(JSON.stringify({type: messageType.TIMER , timer:this.player2Time}))
                    this.Player1.send(JSON.stringify({type: messageType.OPPONENT_TIMER , timer:this.player2Time}))
                }
            }
        }, 1000)
    }

    makeMove(from: string, to: string, socket: WebSocket) {
        console.log(from , to)

        if (socket !== this.Player1 && socket !== this.Player2) {
            return;
        }

        if (this.movesCount % 2 === 0 && socket !== this.Player1) { 
            return;
        }

        if (this.movesCount % 2 === 1 && socket !== this.Player2) { 
            return;
        }

        try {

            const move = this.chess.move({ from, to, promotion:'q'});
            
            if (move) {   
                this.movesCount++;
            }
            
        } catch (error) {
            socket.send(JSON.stringify({type:messageType.INVALID_MOVE , payload:{from , to}}))
            console.log(error)
        }

        if (this.chess.isGameOver()) {
            
            this.Player1.send(JSON.stringify({
                type: messageType.GAME_OVER,
                payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
            }));
            this.Player2.send(JSON.stringify({
                type: messageType.GAME_OVER,
                payload: { winner: this.chess.turn() === 'w' ? 'b' : 'w' }
            }));
        }
        else {
            if (this.movesCount % 2 === 0) {

                this.Player1.send(JSON.stringify({
                    type: messageType.MOVE,
                    move: { from ,to }
                }))
            }
            else {
                
                this.Player2.send(JSON.stringify({
                    type: messageType.MOVE,
                    move: {from ,to} 
                }));
            }
        }
    }

    sendChat(socket:WebSocket , chat:string){
        this.chats.set(socket , chat);
        console.log(chat)
        if(socket === this.Player1){
            this.Player2.send(JSON.stringify({type:messageType.CHAT , chat}))
        }
        else{
            this.Player1.send(JSON.stringify({type:messageType.CHAT , chat}))
        }
    }
}