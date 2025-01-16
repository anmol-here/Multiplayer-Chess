"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.id = 0;
        this.name = '';
        this.Player1 = player1;
        this.Player2 = player2;
        this.board = [];
        this.moves = [];
        this.startTime = new Date();
        this.chess = new chess_js_1.Chess();
        this.movesCount = 0;
        console.log("Initializing the game");
        player1.send(JSON.stringify({ type: message_1.messageType.COLOR, color: 'w' }));
        player2.send(JSON.stringify({ type: message_1.messageType.COLOR, color: 'b' }));
    }
    makeMove(from, to, socket) {
        console.log(from, to);
        if (socket !== this.Player1 && socket !== this.Player2) {
            return;
        }
        if (this.movesCount % 2 === 0 && socket !== this.Player1) {
            return;
        }
        if (this.movesCount % 2 === 1 && socket !== this.Player2) {
            return;
        }
        console.log("I reach here");
        try {
            const move = this.chess.move({ from, to, promotion: 'q' });
            if (move) {
                this.movesCount++;
            }
        }
        catch (error) {
            socket.send(JSON.stringify({ type: message_1.messageType.INVALID_MOVE, payload: { from, to } }));
            console.log(error);
        }
        if (this.chess.isGameOver()) {
            this.Player1.send(JSON.stringify({
                type: 'game_over',
                payload: { winner: this.chess.turn() === 'w' ? 'black' : 'white' }
            }));
            this.Player2.send(JSON.stringify({
                type: 'game_over',
                payload: { winner: this.chess.turn() === 'w' ? 'black' : 'white' }
            }));
        }
        else {
            console.log(this.movesCount);
            if (this.movesCount % 2 === 0) {
                this.Player1.send(JSON.stringify({
                    type: message_1.messageType.MOVE,
                    move: { from, to }
                }));
            }
            else {
                this.Player2.send(JSON.stringify({
                    type: message_1.messageType.MOVE,
                    move: { from, to }
                }));
            }
        }
    }
}
exports.Game = Game;
