/* eslint-disable no-unused-vars */
import GameState from "./GameState";

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

export function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue2 === tileValue3
    ) {
      setStrikeClass(strikeClass);

      if (tileValue1 === PLAYER_X) {
        setGameState(GameState.playerXWins);
      } else {
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }

  const areAllTilesFilled = tiles.every((tile) => tile !== null);
  if (areAllTilesFilled) {
    setGameState(GameState.draw);
  }
  //console.log("win");
}

function checkWinnerAI(tiles) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue2 === tileValue3
    ) {
      //setStrikeClass(strikeClass);

      if (tileValue1 === PLAYER_X) {
        return "X";
      } else {
        return "O";
      }
    }
  }

  const areAllTilesFilled = tiles.every((tile) => tile !== null);
  if (areAllTilesFilled) {
    return "draw";
  }
  return null;
  //console.log("win");
}

export function bestMove(tiles) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (tiles[i] === null) {
      tiles[i] = PLAYER_O;
      let score = minimax(tiles, 0, false);
      //console.log(score);
      tiles[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

let scores = {
  X: -10,
  O: 10,
  draw: 0,
};

function minimax(tiles, depth, isMaximizing) {
  let result = checkWinnerAI(tiles);
  //console.log(result);

  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (tiles[i] === null) {
        tiles[i] = PLAYER_O;
        let score = minimax(tiles, depth + 1, false);
        tiles[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (tiles[i] === null) {
        tiles[i] = PLAYER_X;
        let score = minimax(tiles, depth + 1, true);
        tiles[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
