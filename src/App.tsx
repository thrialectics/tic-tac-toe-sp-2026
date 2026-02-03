import { useState } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  function handleCellClick(position: number) {
    const newState = makeMove(gameState, position);
    setGameState(newState);
  };

  return (
    <div style={{                                                               
      display: "flex",                                                          
      flexDirection: "column",                                                  
      alignItems: "center",                                                     
      justifyContent: "center",                                                 
      height: "100vh"                                                           
    }}>Tic Tac Toe 
    <p>current player: {gameState.currentPlayer}</p>
    <table>                                                                       
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
    </table>  
    <br></br>
    {getWinner(gameState) && <div>Winner: {getWinner(gameState)}</div>}
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
