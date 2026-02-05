import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; 
import type { GameState } from "./tic-tac-toe";
import "./App.css";
import serpentImg from "./assets/serpent.png";  
import doveImg from "./assets/dove.png";                               

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [games, setGames] = useState<GameState[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games");
        const gamesList = await response.json();
        setGames(gamesList);
      } catch (error) {
        console.error('Error fetching games', error);
      }
    }

    fetchGames();
  }, []);

  useEffect(() => {                                                            
    if (gameState?.winner) {                                                               
      confetti({                                                                
        particleCount: 100,                                                     
        spread: 70,                                                             
        origin: { y: 0.6 }                                                      
      });                                                                       
    }                                                                           
  }, [gameState?.winner]);

  async function handleNewGame() {
    try {
      const response = await fetch("/api/games", {
        method: "POST",
      });
      const newGame = await response.json();
      setSelectedGameId(newGame.id)
      setGameState(newGame);
    } catch (error) {
      console.error('Error creating game', error);
    }            
  }

  async function handleSelectGame(id: string) {                                                                                                                                                                            
    setSelectedGameId(id);
    try {
      const response = await fetch(`/api/games/${id}`);
      const game = await response.json();
      setGameState(game);
    } catch (error) {
      console.error('Error fetching game', error);
    }
  }

  async function handleRefresh() {
    try {
      const response = await fetch("/api/games");
      const gamesList = await response.json();
      setGames(gamesList);
      } catch (error) {
        console.error('Error fetching games', error);
      }
  }

  if (selectedGameId === null) {
    return (
      <div className="game-container">
        <h1>Serpents & Doves</h1>
        <p><em>a game of three in a row</em></p>
        <LobbyView
          games={games}
          onSelectGame={handleSelectGame}
          onNewGame={handleNewGame}
          onRefresh={handleRefresh}
        />
      </div>
    );
  }

  if (gameState === null) {
      return <div className="loading">Loading...</div>;
  }

  const { winner, isDraw, currentPlayer, board } = gameState;

  const icons = { "X": <img src={serpentImg} />, "O": <img src={doveImg} /> };

  async function handleCellClick(position: number) {  
    try {
      const response = await fetch(`/api/games/${selectedGameId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position }),
      });
      const newGameState = await response.json();
      setGameState(newGameState);
    } catch (error) {
        console.error('Error fetching game', error);
    }                               
  }
  
  return (
    <div className="game-container">
      <h1>Serpents & Doves</h1>
      <p><em>a game of three in a row</em></p>

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

      <button onClick={handleNewGame} className="new-game-button">                           
        New Game                                                                    
      </button>

      <button onClick={() => {
        setSelectedGameId(null);
        setGameState(null);
        handleRefresh(); 
      }}>
        Back to Lobby
      </button>   
    </div>
  );
}

function LobbyView({
    games,
    onSelectGame,
    onNewGame,
    onRefresh,
  }: {
    games: GameState[];
    onSelectGame: (id: string) => void;
    onNewGame: () => void;
    onRefresh: () => void;
  }) {
    return (
      <div className="lobby">
        <ul>
          {games.map(game => (
            <li key={game.id} onClick={() => onSelectGame(game.id)}>
              Game {game.id.slice(0, 8)} - {gameStatusLabel(game)}
            </li>
          ))}
        </ul>
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onRefresh}>Refresh List</button>
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
  return <p className="current-player">Current Player: {names[currentPlayer]}</p>;
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

export default App;
