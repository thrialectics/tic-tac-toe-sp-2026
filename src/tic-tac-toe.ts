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
  id: string;
  name: string;
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
};

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
] as const;

export function createGame(name?: string): GameState {
  return {
    id: crypto.randomUUID(),
    name: name || "Unnamed Game",
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    winner: null,
    isDraw: false,
  };
}

export function makeMove(state: GameState, position: number): GameState {
  // Validate position is an integer
  if (!Number.isInteger(position)) {
    throw new Error("Position must be an integer")
  }
  
  // Validate position is in bounds
  if (position < 0 || position > 8) {                                           
    throw new Error("Position must be between 0 and 8");                        
  }

  // Validate position is not occupied
  if (state.board[position] !== null) {                                         
    throw new Error("Position is already occupied");                                            
  }

  // Validate game is not over
  if (state.winner !== null) {
    throw new Error("Game is already over")
  }

  // Create new board with the move
  const newBoard = [...state.board] as Board;
  newBoard[position] = state.currentPlayer;

  // Compute new state
  const nextPlayer = state.currentPlayer === "X" ? "O" : "X";
  const winner = computeWinner(newBoard);
  const isDraw = winner === null && newBoard.every(cell => cell !== null);

  return {
    id: state.id,
    name: state.name,
    board: newBoard,
    currentPlayer: nextPlayer,
    winner,
    isDraw,
  };
}

export function getWinner(state: GameState): Player | null {
  return state.winner;
}

export function isDraw(state: GameState): boolean {
  return state.isDraw;
}

function computeWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}
