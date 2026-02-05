import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; 
import type { GameState } from "./tic-tac-toe";
import "./App.css";
import serpentImg from "./assets/serpent.png";  
import doveImg from "./assets/dove.png";                               

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch("/api/game");
        const newGameState = await response.json();
        setGameState(newGameState);
      } catch (error) {
        console.error('Error fetching game', error);
      }
    }

    fetchGameState();
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

  if (gameState === null) {
    return <div className="loading">Loading...</div>;
  };

  const { winner, isDraw, currentPlayer, board } = gameState;

  const icons = { "X": <img src={serpentImg} />, "O": <img src={doveImg} /> };

  async function handleCellClick(position: number) {  
    try {
      const response = await fetch("/api/move", {
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

  async function handleNewGame() {
    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newGameState = await response.json();
      setGameState(newGameState);
    } catch (error) {
      // Invalid moves silently ignored
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

export default App;
