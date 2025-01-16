"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
        console.log('Game created');
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
        else {
            this.users.filter(item => item != socket);
        }
    }
    addHandler(socket) {
        socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            if (message.type === message_1.messageType.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    // console.log(this.games)
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            else if (message.type === message_1.messageType.MOVE) {
                const game = this.games.find(g => g.Player1 === socket || g.Player2 === socket);
                if (game && message.move && message.move.from && message.move.to) {
                    game.makeMove(message.move.from, message.move.to, socket);
                }
            }
        };
    }
}
exports.GameManager = GameManager;
