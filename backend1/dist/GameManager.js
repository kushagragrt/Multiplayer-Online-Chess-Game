"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null; // Initialize pendingUser to null
        this.users = []; // Initialize users array
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the game because user left
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === message_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket); // Use renamed type
                    this.games.push(game); // Store the created game
                    this.pendingUser = null; // Reset pendingUser after game creation
                }
                else {
                    this.pendingUser = socket; // Set pendingUser if not already set
                }
            }
            if (message.type === message_1.MOVE) {
                console.log("Inside Move");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("Inside makeMove");
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
