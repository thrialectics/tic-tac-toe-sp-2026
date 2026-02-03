export type Player = "X" | "O";

export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
};

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    winner: null,
  };
}

export function makeMove(state: GameState, position: number): GameState {
  if (position < 0 || position > 8) {                                           
    throw new Error("Position must be between 0 and 8");                        
  }

  if (!Number.isInteger(position)) {
    throw new Error("Position must be an integer")
  }

  if (state.board[position] !== null) {                                         
    throw new Error("Position is already occupied");                                            
  }

  const winner = getWinner(state);
  if (winner !== null) {
    throw new Error("Game is already over");
  }

  const newBoard = [...state.board] as Board;
  newBoard[position] = state.currentPlayer;

  const newState: GameState = {
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    winner: null as (Player | null),
  }

  newState.winner = getWinner(newState);

  return newState;
}

export function isDraw(state: GameState): boolean {                           
    return getWinner(state) === null && state.board.every(cell => cell !==      
  null);                                                                        
  }
  
export function getWinner(state: GameState): Player | null {
  const board = state.board;

  const winningCombos = [                                                       
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows                                   
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns                                
    [0, 4, 8], [2, 4, 6]              // diagonals                              
  ];

  for (const [a, b, c] of winningCombos) {
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  return null;
}
