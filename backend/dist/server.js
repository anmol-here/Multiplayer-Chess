"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const { GameManager } = require('./GameManager');
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = new http_1.default.Server(app);
const wss = new ws_1.WebSocketServer({ server });
const gameManager = new GameManager();
app.get("/", (req, res) => {
    return res.send('Hello World');
});
wss.on("connection", ws => {
    console.log("Connected");
    gameManager.addUser(ws);
    ws.on("close", () => {
        console.log("Disconnected");
        gameManager.removeUser(ws);
    });
});
server.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
});
