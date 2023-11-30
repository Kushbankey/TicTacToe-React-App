export default function Opponent({
  select,
  setSelect,
  opponent,
  onSetOpponent,
}) {
  if (select === 1) {
    return (
      <div className="opponent">
        <div className="opponent-name">Playing against {opponent.toUpperCase()}!</div>
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
