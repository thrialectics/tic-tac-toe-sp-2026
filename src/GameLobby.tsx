import React, { useState, useEffect } from "react";
import type { GameState } from "./tic-tac-toe";
import serpentImg from "./assets/serpent.png";
import doveImg from "./assets/dove.png";

function GameLobby({ onGameSelect }: { onGameSelect: (id: string) => void }) {
  const [games, setGames] = useState<GameState[]>([]);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [newGameName, setNewGameName] = useState("");
  const [nameError, setNameError] = useState(false);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const gamesList = await response.json();
      setGames(gamesList);
    } catch (error) {
      console.error('Error fetching games', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  async function handleNewGame() {
    if (!newGameName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGameName.trim() }),
      });
      const newGame = await response.json();
      setNewGameName("");
      onGameSelect(newGame.id);
    } catch (error) {
      console.error('Error creating game', error);
    }
  }

  function toggleExpand(gameId: string) {
    setExpandedGameId(prev => prev === gameId ? null : gameId);
  }

  async function handleDeleteGame(gameId: string) {
    try {
      await fetch(`/api/games/${gameId}`, { method: "DELETE" });
      setExpandedGameId(null);
      fetchGames();
    } catch (error) {
      console.error('Error deleting game', error);
    }
  }

  const icons: Record<string, React.ReactNode> = {
    "X": <img src={serpentImg} alt="Serpent" />,
    "O": <img src={doveImg} alt="Dove" />,
  };

  return (
    <div className="lobby">
      <ul>
        {games.map(game => {
          const isExpanded = expandedGameId === game.id;
          return (
            <li
              key={game.id}
              className={`lobby-game ${isExpanded ? "lobby-game--expanded" : ""}`}
            >
              <div
                className="lobby-game__header"
                onClick={() => toggleExpand(game.id)}
              >
                <span>{game.name}</span>
                <span className="lobby-game__status">{gameStatusLabel(game)}</span>
              </div>

              {isExpanded && (
                <div className="lobby-game__preview" onClick={e => e.stopPropagation()}>
                  <div className="mini-board">
                    {game.board.map((cell, i) => (
                      <div key={i} className="mini-board__cell">
                        {cell && icons[cell]}
                      </div>
                    ))}
                  </div>
                  <div className="lobby-game__actions">
                    <button
                      className="lobby-game__enter"
                      onClick={() => onGameSelect(game.id)}
                    >
                      Enter Game
                    </button>
                    <button
                      className="lobby-game__delete"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="new-game-form">
        <input
          type="text"
          className="new-game-input"
          placeholder="Name your game..."
          value={newGameName}
          onChange={e => { setNewGameName(e.target.value); setNameError(false); }}
          onKeyDown={e => e.key === "Enter" && handleNewGame()}
        />
        {nameError && <span className="name-error">Please name your game first</span>}
        <button onClick={handleNewGame} className="button">New Game</button>
      </div>
      <span onClick={fetchGames} className="refresh-link">&#x21E3; Refresh Games</span>
    </div>
  );
}

function gameStatusLabel(game: GameState): string {
  const names = { "X": "Serpent", "O": "Dove" };

  if (game.winner) {
    return names[game.winner] + " won";
  }
  if (game.isDraw) {
    return "Draw";
  }
  if (game.board.every(cell => cell === null)) {
    return "First Turn";
  }
  return "In progress";
}

export default GameLobby;
