import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { GameState } from "./tic-tac-toe";
import serpentImg from "./assets/serpent.png";
import doveImg from "./assets/dove.png";

function GameView({
  gameId,
  onBackToLobby,
  onGameSelect,
}: {
  gameId: string;
  onBackToLobby: () => void;
  onGameSelect: (id: string) => void;
}) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        const game = await response.json();
        setGameState(game);
      } catch (error) {
        console.error('Error fetching game', error);
      }
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (gameState?.winner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameState?.winner]);

  async function handleCellClick(position: number) {
    try {
      const response = await fetch(`/api/games/${gameId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position }),
      });
      const newGameState = await response.json();
      setGameState(newGameState);
    } catch (error) {
      console.error('Error making move', error);
    }
  }

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

  if (gameState === null) {
    return <div className="loading">Loading...</div>;
  }

  const { winner, isDraw, currentPlayer, board } = gameState;
  const icons = { "X": <img src={serpentImg} />, "O": <img src={doveImg} /> };

  return (
    <div>
      <GameStatus winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} />

      <table>
        <tbody>
          {[0, 1, 2].map(row => (
            <tr key={row}>
              {[0, 1, 2].map(col => {
                const position = row * 3 + col;
                return (
                  <td key={position} onClick={() => handleCellClick(position)}>
                    {board[position] && icons[board[position]]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleNewGame} className="button">
        New Game
      </button>

      <span onClick={onBackToLobby} className="back-link">&#x21E0; Back to Lobby</span>
    </div>
  );
}

function GameStatus({
  winner,
  isDraw,
  currentPlayer
}: {
  winner: "X" | "O" | null;
  isDraw: boolean;
  currentPlayer: "X" | "O";
}) {
  const names = { "X": "Serpent", "O": "Dove" };

  if (winner) {
    return <div className="winner">Winner: {names[winner]}</div>;
  }
  if (isDraw) {
    return <div className="draw">It's a draw!</div>;
  }
  const playerClass = currentPlayer === "X" ? "current-player--serpent" : "current-player--dove";
  return <p className={`current-player ${playerClass}`}>Current Player: {names[currentPlayer]}</p>;
}

export default GameView;
