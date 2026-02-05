import express from "express";
import ViteExpress from "vite-express";
import { createGame, makeMove } from "./tic-tac-toe";

const app = express();
let gameState = createGame()

app.use(express.json())

app.post("/api/reset", (_req, res) => {
    gameState = createGame();
    res.json(gameState);
});

app.post("/api/move", (req, res) => {
    const position = req.body.position;
    gameState = makeMove(gameState, position);
    res.json(gameState);
});

app.get("/api/game", (_req, res) => {
    res.json(gameState);
});

// Export the app so tests can import it without starting the server
export { app };

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
