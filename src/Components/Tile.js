export default function Tile({ className, value, onClick, turn }) {
    let hoverClass = null;
    if (value == null && turn != null) {
      hoverClass = `${turn.toLowerCase()}-hover`;
    }
  
    return (
      <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
        {value}
      </div>
    );
  }