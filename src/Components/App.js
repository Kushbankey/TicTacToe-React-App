import { useEffect, useState } from "react";
import "../App.css";
import Board from "./Board.js";
import GameOver from "./GameOver.js";
import Reset from "./Reset.js";
import Opponent from "./Opponent.js";
import GameState from "../GameState.js";
import { bestMove, checkWinner } from "../CheckWinner.js";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

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
        if (gameState === GameState.inProgress) {
          const newTiles = [...tiles];
          newTiles[index] = turn;
          setTiles(newTiles);

          setTurn(PLAYER_X);
        }
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
