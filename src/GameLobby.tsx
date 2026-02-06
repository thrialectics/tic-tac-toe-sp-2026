import { useState, useEffect } from "react";
import type { GameState } from "./tic-tac-toe";

function GameLobby({ onGameSelect }: { onGameSelect: (id: string) => void }) {
  const [games, setGames] = useState<GameState[]>([]);

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
    try {
      const response = await fetch("/api/games", {
        method: "POST",
      });
      const newGame = await response.json();
      onGameSelect(newGame.id);
    } catch (error) {
      console.error('Error creating game', error);
    }
  }

  return (
    <div className="lobby">
      <ul>
        {games.map(game => (
          <li key={game.id} onClick={() => onGameSelect(game.id)}>
            Game {game.id.slice(0, 8)} - {gameStatusLabel(game)}
          </li>
        ))}
      </ul>
      <button onClick={handleNewGame} className="button">New Game</button>
      <button onClick={fetchGames} className="button">Refresh List</button>
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
    return "New";
  }
  return "In progress";
}

export default GameLobby;
