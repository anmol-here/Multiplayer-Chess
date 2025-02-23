import { Game } from "./Game";
import { messageType } from "./message";

interface GameMessage {
    type: messageType;
    move: {   
        from?: string | undefined;
        to?: string | undefined;
    };
    chat:string;
}

export class GameManager { 
    private games: Game[];
    private users: WebSocket[];
    private pendingUser: WebSocket | null;

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
        console.log('Game created');
    }

    addUser(socket:WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket:WebSocket) {
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
        else {
            this.users.filter(item => item != socket)
        }
    }

    private addHandler(socket: WebSocket) {

        socket.onmessage = (event) => {

            let message:GameMessage = JSON.parse(event.data)

            if (message.type === messageType.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            else if (message.type === messageType.MOVE) {

                const game = this.games.find(g => g.Player1 === socket || g.Player2 === socket);
                if (game && message.move && message.move.from && message.move.to) {
                    game.makeMove(message.move.from , message.move.to , socket);
                }
            }
            else if(message.type === messageType.CHAT){
                const game = this.games.find(g => g.Player1 === socket || g.Player2 === socket);
                if(game){
                    game.sendChat(socket , message.chat as string);
                }
            }
        }
    }
}