import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./server";

// ---------------------------------------------------------------------------
// POST /api/games
// Create New Game
// ---------------------------------------------------------------------------
describe("POST /api/games", () => {
  it("creates a new game with a valid uuid", async () => {
  const response = await request(app).post("/api/games");
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("string");
    expect(response.body.board).toEqual([null, null, null, null, null, null, null, null, null]);
    expect(response.body.currentPlayer).toBe("X");
    expect(response.body.winner).toBeNull();
    expect(response.body.isDraw).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/games
// List all Games
// ---------------------------------------------------------------------------
describe("GET /api/games", () => {
  it("returns a list of all the Games in play", async () => {
    const createResponse = await request(app).post("/api/games");
    const gameId = createResponse.body.id;

    const listResponse = await request(app).get("/api/games");
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);

    const ids = listResponse.body.map((game: { id: string }) => game.id);
    expect(ids).toContain(gameId);
  });
});
  

// ---------------------------------------------------------------------------
// GET /api/games/:id
// Get a specific Game
// ---------------------------------------------------------------------------
describe("GET /api/games/:id", () => {
  it("returns the correct game by id", async () => {
    const createResponse = await request(app).post("/api/games");
    const gameId = createResponse.body.id;

    const getResponse = await request(app).get(`/api/games/${gameId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(gameId);
    expect(getResponse.body.board).toEqual([null, null, null, null, null, null, null, null, null]);
  });

  it("returns 404 for nonexistent game id", async () => {
    const response = await request(app).get("/api/games/not-a-real-id");
    expect(response.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/games/:id/move
// Make a move on a game
// ---------------------------------------------------------------------------
describe("POST /api/games/:id/move", () => {
  it("makes a move in the right game id", async () => {
    const createResponse = await request(app).post("/api/games");
    const gameId = createResponse.body.id;

    const moveResponse = await request(app)
      .post(`/api/games/${gameId}/move`)
      .send({ position: 0 });
    expect(moveResponse.status).toBe(200);
    expect(moveResponse.body.board[0]).toBe("X");
    expect(moveResponse.body.currentPlayer).toBe("O");
  });

  it("returns 404 for nonexistent game id", async () => {
    const response = await request(app)
      .post("/api/games/not-a-real-id/move")
      .send({ position: 0 });
    expect(response.status).toBe(404);
  });

  it("returns 400 for invalid move", async () => {
    const createResponse = await request(app).post("/api/games");
    const gameId = createResponse.body.id;

    const response = await request(app)
      .post(`/api/games/${gameId}/move`)
      .send({ position: 99 });
    expect(response.status).toBe(400);
  });
});
