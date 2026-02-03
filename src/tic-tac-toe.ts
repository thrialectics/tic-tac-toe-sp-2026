// "export" makes this type available to other files that import from this module.
// "type" declares a TypeScript type alias - it gives a name to a type.
// "Player" is the name we're creating for this type.
// "X" | "O" is a union type - it means Player can ONLY be the literal string "X" OR the literal string "O".
// This is more restrictive than just "string" - TypeScript will error if you try to use "Z" as a Player.
export type Player = "X" | "O";

// Another type alias. Cell represents what can be in a single square of the board.
// "Player | null" is a union of the Player type (which is "X" | "O") and null.
// So Cell can be "X", "O", or null (empty square).
// This expands to: "X" | "O" | null
export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8

// This is a tuple type - a fixed-length array where each position has a specific type.
// [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell] means exactly 9 elements, each of type Cell.
// This is different from Cell[] which would allow any number of elements.
// TypeScript will enforce that Board always has exactly 9 elements.
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

// This defines an object type using curly braces {}.
// GameState has two properties:
//   - board: must be of type Board (our 9-element tuple)
//   - currentPlayer: must be of type Player ("X" or "O")
// This groups related data together - the board state and whose turn it is.
export type GameState = {
  board: Board;
  currentPlayer: Player;
};

// "function" declares a function.
// "createGame" is the function name.
// "()" means it takes no parameters.
// ": GameState" after the parentheses is the return type annotation - this function must return a GameState.
// This is a "factory function" - it creates and returns a new object.
export function createGame(): GameState {
  // "return" sends a value back to whoever called this function.
  // We're returning an object literal that matches the GameState type.
  return {
    // "board:" is the property name, followed by its value.
    // We initialize with 9 nulls - an empty board where no moves have been made.
    // This array literal matches our Board tuple type (9 Cell elements).
    board: [null, null, null, null, null, null, null, null, null],
    // X always goes first in tic-tac-toe, so we start with "X" as the current player.
    currentPlayer: "X",
  };
}

// This function takes two parameters:
//   - state: the current GameState (board + current player)
//   - position: a number (0-8) indicating which cell to play in
// It returns a new GameState (the state after the move).
// Note: This is currently a stub - it just returns the unchanged state.
// You'll need to implement the actual move logic.
export function makeMove(state: GameState, position: number): GameState {
  // TODO: This should create a NEW state with:
  //   1. The current player's mark placed at the given position
  //   2. The current player switched to the other player
  // Currently it just returns the same state unchanged (placeholder implementation).
  return state;
}

// This function checks if someone has won the game.
// It takes the current GameState and returns:
//   - "X" if X has won
//   - "O" if O has won
//   - null if no winner yet (game still in progress or draw)
// Note: This is currently a stub - it always returns null.
// You'll need to implement the win-checking logic.
export function getWinner(state: GameState): Player | null {
  // TODO: Check all winning combinations:
  //   - 3 rows (0-1-2, 3-4-5, 6-7-8)
  //   - 3 columns (0-3-6, 1-4-7, 2-5-8)
  //   - 2 diagonals (0-4-8, 2-4-6)
  // Currently always returns null (placeholder implementation).
  return null;
}
