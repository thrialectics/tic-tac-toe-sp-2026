import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; 
import { createGame, makeMove } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";
import "./App.css";
import serpentImg from "./serpent.png";  
import doveImg from "./dove.png";                               

function App() {
  const [gameState, setGameState] = useState<GameState>(createGame);

  const { winner, isDraw, currentPlayer, board } = gameState;

  const icons = { "X": <img src={serpentImg} />, "O": <img src={doveImg} /> };

  function handleCellClick(position: number) {                                  
    try {                                                                       
      const newState = makeMove(gameState, position);                           
      setGameState(newState);                                                   
    } catch (error) {
      // Invalid moves silently ignored                                                   
    }                                                                           
  }      

  function handleNewGame() {
    setGameState(createGame());
  }

  useEffect(() => {                                                            
    if (winner) {                                                               
      confetti({                                                                
        particleCount: 100,                                                     
        spread: 70,                                                             
        origin: { y: 0.6 }                                                      
      });                                                                       
    }                                                                           
  }, [winner]);

  return (
    <div className="game-container">
      <h1>Tic Tac Serpent/Dove</h1>

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
