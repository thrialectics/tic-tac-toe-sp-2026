import express from "express";
import ViteExpress from "vite-express";
import { createGame, makeMove } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";

const app = express();
const games = new Map<string, GameState>();

app.use(express.json())

app.post("/api/games", (_req, res) => {
    const game = createGame();
    games.set(game.id, game);
    res.json(game);
});

app.post("/api/games/:id/move", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    const position = req.body.position
    try {
      const setGame = makeMove(game, position);
      games.set(req.params.id, setGame);
      res.json(setGame);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid move";
      res.status(400).json({ error: message });
    }
});

app.get("/api/games", (_req, res) => {
    res.json(Array.from(games.values()));
});

app.get("/api/games/:id", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.json(game);
});

// Export the app so tests can import it without starting the server
export { app };

ViteExpress.listen(app, parseInt(process.env.PORT || "3000"), () => console.log("Server is listening..."));
