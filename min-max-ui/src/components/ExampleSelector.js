const examples = [
  {
    name: "Simple Ascending",
    array: [1, 2, 3, 4, 5],
    queries: [1, 2, 3, 4, 5],
    description: "A simple ascending array."
  },
  {
    name: "Mixed Values",
    array: [1, 5, 2, 8, 3, 4, 4, 2],
    queries: [1, 3, 6],
    description: "Array with mixed values and some duplicates."
  },
  {
    name: "Provided Example",
    array: [1,2,3,4,5,9,4,1], // The one we discussed earlier
    queries: [1, 3, 5, 8],
    description: "The example discussed during algorithm explanation."
  },
  {
    name: "All Same",
    array: [7, 7, 7, 7, 7],
    queries: [1, 2, 3],
    description: "Array with all identical elements."
  },
  {
    name: "Descending",
    array: [5, 4, 3, 2, 1],
    queries: [1, 2, 3, 4, 5],
    description: "A simple descending array."
  }
];

const ExampleSelector = ({ onSelectExample }) => {
  return (
    <div className="example-selector" style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9' 
      }}>
      <h4 style={{ marginTop: '0', marginBottom: '10px', textAlign: 'center' }}>Load an Example:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {examples.map((ex, index) => (
          <button 
            key={index} 
            onClick={() => onSelectExample(ex.array, ex.queries)}
            title={ex.description}
            style={{
                padding: '8px 12px',
                border: '1px solid #007bff',
                backgroundColor: '#e7f3ff',
                color: '#007bff',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cce5ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e7f3ff'}
          >
            {ex.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleSelector;