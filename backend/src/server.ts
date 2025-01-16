import { WebSocketServer } from "ws"
import express from "express";
const { GameManager } = require('./GameManager');
import http from 'http';

const app = express();

const server = new http.Server(app);

const wss = new WebSocketServer({ server })
const gameManager = new GameManager();

app.get("/", (req:Request, res:any) => {
    return res.send('Hello World')
})

wss.on("connection", ws => { 

    console.log("Connected")

    gameManager.addUser(ws);
    ws.on("close", () => {
        console.log("Disconnected")
        gameManager.removeUser(ws);
    })
})

server.listen(4000, () => {
    console.log("Server started on http://localhost:4000")
})