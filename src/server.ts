import express from "express";
import ViteExpress from "vite-express";
import fs from "fs";
import os from "os";
import path from "path";
import { createGame, makeMove } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";

const app = express();

const DATA_FILE = path.join(os.tmpdir(), "serpents-and-doves-games.json");

function loadGames(): Map<string, GameState> {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const entries: [string, GameState][] = JSON.parse(data);
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function saveGames() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(Array.from(games.entries()), null, 2));
}

const games = loadGames();

app.use(express.json())

app.post("/api/games", (req, res) => {
    const game = createGame(req.body.name);
    games.set(game.id, game);
    saveGames();
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
      saveGames();
      res.json(setGame);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid move";
      res.status(400).json({ error: message });
    }
});

app.get("/api/games", (_req, res) => {
    res.json(Array.from(games.values()));
});

app.delete("/api/games/:id", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    games.delete(req.params.id);
    saveGames();
    res.json({ success: true });
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
