const ResultsDisplay = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>No results to display yet. Submit your array and queries above.</p>;
  }

  return (
    <div className="results-container">
      <h2>Results:</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            For query length <strong>d = {result.queryD}</strong>, the answer is <strong>{result.answer}</strong>
            {result.answer === -1 ? (
              <span style={{ color: 'orange', marginLeft: '5px' }}>Invalid query (e.g., d out of bounds)</span>
            ) : (
              <span style={{ marginLeft: '5px' }}>the answer is <strong>{result.answer}</strong></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsDisplay;