import './ConceptualArrayDisplay.css';

const ConceptualArrayDisplay = ({ originalArray, conceptualBinaryArray, currentValueX, maxRunLength, maxRunStartIndex }) => {
  if (!originalArray || !conceptualBinaryArray || originalArray.length !== conceptualBinaryArray.length) {
    return <p>Waiting for data to visualize...</p>;
  }

  return (
    <div className="visualization-container">
      <h4>Algorithm Step Visualization</h4>
      <p>Current Threshold (X): <strong>{currentValueX === null ? "Initial" : currentValueX}</strong></p>
      <p>Longest Run of Usable (&lt;=X) Elements: <strong>{maxRunLength}</strong></p>
      
      <div className="array-display original-array">
        <strong>Original Array:</strong>
        {originalArray.map((val, index) => (
          <span key={`orig-${index}`} className="array-cell">
            {val}
          </span>
        ))}
      </div>

      <div className="array-display conceptual-array">
        <strong>Conceptual (Usable &lt;= X):</strong>
        {conceptualBinaryArray.map((bit, index) => {
          let cellClass = "array-cell conceptual-cell ";
          cellClass += bit === 1 ? "is-one" : "is-zero";
          
          // Highlight the max run
          if (maxRunStartIndex !== -1 && index >= maxRunStartIndex && index < maxRunStartIndex + maxRunLength) {
            cellClass += " in-max-run";
          }

          return (
            <span key={`conc-${index}`} className={cellClass}>
              {bit}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ConceptualArrayDisplay;