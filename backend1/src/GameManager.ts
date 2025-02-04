import { WebSocket as WS } from "ws"; // Rename imported WebSocket to WS
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./message";

export class GameManager {
    private games: Game[]; // Array to store games
    private pendingUser: WS | null; // Use renamed type for pendingUser
    private users: WS[]; // Use renamed type for users array

    constructor() {
        this.games = [];
        this.pendingUser = null; // Initialize pendingUser to null
        this.users = []; // Initialize users array
    }

    addUser(socket: WS) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WS) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the game because user left
    }

    private addHandler(socket: WS) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket); // Use renamed type
                    this.games.push(game); // Store the created game
                    this.pendingUser = null; // Reset pendingUser after game creation
                } else {
                    this.pendingUser = socket; // Set pendingUser if not already set
                }
            }
            if(message.type===MOVE)
            {
                console.log("Inside Move");
                const game = this.games.find(game=>game.player1===socket ||game.player2===socket);
                if(game)
                {
                    console.log("Inside makeMove");
                    game.makeMove(socket,message.move);
                }
            }
        });
    }
}
