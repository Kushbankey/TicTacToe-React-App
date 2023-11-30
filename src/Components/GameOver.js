import GameState from "../GameState";

export default function GameOver({ gameState, opponent }) {
  switch (gameState) {
    case GameState.inProgress:
      return <></>;

    case GameState.playerXWins:
      return <div className="game-over">{opponent==="friend"?`X Wins`:`You Win!`}</div>;

    case GameState.playerOWins:
      return <div className="game-over">{opponent==="friend"?`O Wins`:opponent==="computer"?`Computer Wins`:`AI Wins`}</div>;

    case GameState.draw:
      return <div className="game-over">Draw</div>;

    default:
      return <></>;
  }
}
