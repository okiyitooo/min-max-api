import React, { useEffect, useState } from 'react';

const InputForm = ({ onSubmit, isLoading, onClear, initialArray, initialQueries }) => {
  const [arrayInput, setArrayInput] = useState('');
  const [queriesInput, setQueriesInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setArrayInput(initialArray?initialArray.join(', '):'');
  }, [initialArray])
  useEffect(()=>{
    setQueriesInput(initialQueries?initialQueries.join(', '):'');
  }, [initialQueries])
  const validateAndParse = () => {
    const newErrors = {};
    let parsedArray = [];
    let parsedQueries = [];

    if (!arrayInput.trim()) {
      newErrors.array = 'Array input cannot be empty.';
    } else {
      parsedArray = arrayInput
        .split(/[\s,]+/)
        .filter(s => s.trim() !== '')
        .map(valStr => {
          const num = Number(valStr);
          if (isNaN(num)) {
            newErrors.array = newErrors.array || 'Array contains non-numeric values.';
          }
          return num;
        });
      if (parsedArray.some(isNaN) && !newErrors.array) {
        newErrors.array = 'Array contains non-numeric values.';
      }
      if (!newErrors.array && parsedArray.length === 0) {
        newErrors.array = 'Array input cannot be empty after parsing.';
      }
    }

    if (!queriesInput.trim()) {
      newErrors.queries = 'Queries input cannot be empty.';
    } else {
      parsedQueries = queriesInput
        .split(/[\s,]+/)
        .filter(s => s.trim() !== '')
        .map(valStr => {
          const num = Number(valStr);
          if (isNaN(num)) {
            newErrors.queries = newErrors.queries || 'Queries input contains non-numeric values.';
          } else if (num < 1) {
            newErrors.queries = newErrors.queries || 'Query lengths (d) must be positive integers.';
          }
          return num;
        });
      if (parsedQueries.some(isNaN) && !newErrors.queries) {
        newErrors.queries = 'Queries input contains non-numeric values.';
      }
      if (!newErrors.queries && parsedQueries.length === 0) {
        newErrors.queries = 'Queries input cannot be empty after parsing.';
      }
    }
    
    // Further validation: query d within bounds of array size
    if (!newErrors.queries && parsedArray.length > 0 && parsedQueries.length > 0) {
        for (const d of parsedQueries) {
            if (d > parsedArray.length) {
                newErrors.queries = newErrors.queries || `Query length d=${d} is larger than the array size (${parsedArray.length}).`;
                break;
            }
        }
    }


    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return null;
    }
    return { array: parsedArray, queries: parsedQueries };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = validateAndParse();
    if (formData) {
      onSubmit(formData);
    }
  };

  const handleClear = () => {
    if (onClear) onClear();
    setArrayInput('');
    setQueriesInput('');
    setErrors({});
    // Optionally, tell parent to clear results too if you want that behavior
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div>
        <label htmlFor="arrayInput">Enter Array (comma or space-separated numbers):</label>
        <input
          type="text"
          id="arrayInput"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="e.g., 1, 2, 3, 4, 5"
          disabled={isLoading} 
        />
        {errors.array && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{errors.array}</p>}
      </div>
      <div>
        <label htmlFor="queriesInput">Enter Query Lengths (d) (comma or space-separated):</label>
        <input
          type="text"
          id="queriesInput"
          value={queriesInput}
          onChange={(e) => setQueriesInput(e.target.value)}
          placeholder="e.g., 1, 3, 5"
          disabled={isLoading}
        />
        {errors.queries && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{errors.queries}</p>}
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
        <button type="button" onClick={handleClear} disabled={isLoading} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default InputForm;