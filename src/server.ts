import express from "express";
import expressWs from "express-ws";
import type { WebSocket } from "ws";
import type { Application } from "express-ws";
import ViteExpress from "vite-express";
import { createGame, makeMove } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";

const { app: expressApp } = expressWs(express());
const app = expressApp as Application;

const games = new Map<string, GameState>();
const gameConnections = new Map<string, Set<WebSocket>>();

function broadcastGameUpdate(gameId: string, gameState: GameState) {
  const connections = gameConnections.get(gameId);
  if (connections) {
    connections.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'gameUpdate', gameState }));
      }
    });
  }
}

app.use(express.json());

app.ws("/api/games/:id/ws", (ws, req) => {
  const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const game = games.get(gameId);
  if (!game) {
    ws.close(1008, 'Game not found');
    return;
  }
  if (!gameConnections.has(gameId)) {
    gameConnections.set(gameId, new Set());
  }
  gameConnections.get(gameId)!.add(ws);
  ws.send(JSON.stringify({ type: 'gameUpdate', gameState: game }));
  ws.on('close', () => {
    const connections = gameConnections.get(gameId);
    if (connections) {
      connections.delete(ws);
      if (connections.size === 0) {
        gameConnections.delete(gameId);
      }
    }
  });
});

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
  const position = req.body.position;
  try {
    const setGame = makeMove(game, position);
    games.set(req.params.id, setGame);
    broadcastGameUpdate(req.params.id, setGame);
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

ViteExpress.listen(app as any, 3000, () => console.log("Server is listening..."));
