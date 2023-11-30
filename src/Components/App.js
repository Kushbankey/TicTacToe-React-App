import { useEffect, useState } from "react";
import "../App.css";
import Board from "./Board.js";
import GameOver from "./GameOver.js";
import Reset from "./Reset.js";
import GameState from "../GameState.js";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

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

function checkWinner(tiles, setStrikeClass, setGameState) {
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

function bestMove(tiles) {
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

export default function App() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [opponent, setOpponent] = useState("friend");
  const [select, setSelect] = useState(0);

  const handleTileClick = (index) => {
    if (select === 0) {
      alert("Click set!");
      return;
    }
    if (gameState !== GameState.inProgress || tiles[index] !== null) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = turn;
    setTiles(newTiles);

    if (turn === PLAYER_X) {
      setTurn(PLAYER_O);
    } else {
      setTurn(PLAYER_X);
    }
  };

  if (opponent === "computer") {
    if (turn === PLAYER_O && gameState === GameState.inProgress) {
      let available = [];

      for (let i = 0; i < 9; i++) {
        if (tiles[i] === null) {
          available.push(i);
        }
      }

      const l = available.length;
      const index = available[Math.floor(Math.random() * l)];

      setTimeout(() => {
        const newTiles = [...tiles];
        newTiles[index] = turn;
        setTiles(newTiles);

        setTurn(PLAYER_X);
      }, 1000);
    }
  }
  if (opponent === "ai") {
    if (turn === PLAYER_O && gameState === GameState.inProgress) {
      const index = bestMove(tiles);
      //console.log(index);

      setTimeout(() => {
        const newTiles = [...tiles];
        newTiles[index] = turn;
        setTiles(newTiles);

        setTurn(PLAYER_X);
      }, 1000);
    }
  }

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setTurn(PLAYER_X);
    setStrikeClass(null);
    setSelect(0);
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Opponent
        select={select}
        setSelect={setSelect}
        opponent={opponent}
        onSetOpponent={setOpponent}
      />
      <Board
        turn={turn}
        tiles={tiles}
        onTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <GameOver gameState={gameState} opponent={opponent} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

function Opponent({ select, setSelect, opponent, onSetOpponent }) {
  if (select === 1) {
    return (
      <div className="opponent">
        <div className="opponent-name">Playing against {opponent}!</div>
      </div>
    );
  }
  return (
    <div className="opponent">
      <div className="top-div">
        <div>
          <input
            type="radio"
            id="friend"
            value="friend"
            name="opponent"
            checked={opponent === "friend"}
            disabled={select === 1}
            onChange={() => onSetOpponent("friend")}
          />
          <label htmlFor="friend">Friend</label>
        </div>

        <div>
          <input
            type="radio"
            id="computer"
            value="computer"
            name="opponent"
            checked={opponent === "computer"}
            disabled={select === 1}
            onChange={() => onSetOpponent("computer")}
          />
          <label htmlFor="computer">Computer</label>
        </div>
        <div>
          <input
            type="radio"
            id="AI"
            value="AI"
            name="opponent"
            checked={opponent === "ai"}
            disabled={select === 1}
            onChange={() => onSetOpponent("ai")}
          />
          <label htmlFor="AI">AI</label>
        </div>
      </div>
      <div className="bottom-div">
        <button className="set-button" onClick={() => setSelect(1)}>
          Set
        </button>
      </div>
    </div>
  );
}
