import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; 
import { createGame, makeMove, getWinner, isDraw } from "./tic-tac-toe";
import "./App.css";                                      

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  function handleCellClick(position: number) {                                  
    try {                                                                       
      const newState = makeMove(gameState, position);                           
      setGameState(newState);                                                   
    } catch (e) {                                                   
    }                                                                           
  }      

  const winner = getWinner(gameState);

  useEffect(() => { 
    console.log("Winner changed:", winner);                                                            
    if (winner) {                                                               
      confetti({                                                                
        particleCount: 100,                                                     
        spread: 70,                                                             
        origin: { y: 0.6 }                                                      
      });                                                                       
    }                                                                           
  }, [winner]);

  return (
    <div style={{                                                               
      display: "flex",                                                          
      flexDirection: "column",                                                  
      alignItems: "center",                                                     
      justifyContent: "center",                                                 
      height: "100vh"                                                           
    }}>
    <h1>Tic Tac Toe</h1>
    {winner ? (                                                                   
      <div className="winner">Winner: {winner}</div>                              
    ) : isDraw(gameState) ? (                                                                
      <div>It's a draw!</div>                                                     
    ) : (                                                                         
      <p>Current player: {gameState.currentPlayer}</p>                            
    )} 
    <table>                                                                       
      <tbody>                                                                     
        {[0, 1, 2].map(row => (                                                   
          <tr key={row}>                                                          
            {[0, 1, 2].map(col => {                                               
              const position = row * 3 + col;                                     
              return (                                                            
                <td key={position} onClick={() => handleCellClick(position)}>     
                  {gameState.board[position] ?? "_"}                              
                </td>                                                             
              );                                                                  
            })}                                                                   
          </tr>                                                                   
        ))}                                                                       
      </tbody>                                                                    
    </table> 
    <br></br>
    <button onClick={() => setGameState(createGame())}>                           
      New Game                                                                    
    </button>   
    </div>);
}

function getInitialGame() {                                                   
    return createGame()                                                         
} 

export default App;
