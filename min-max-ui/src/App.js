// src/App.js
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import './App.css';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExampleSelector from './components/ExampleSelector';
import ConceptualArrayDisplay from './components/ConceptualArrayDisplay'; // Import
import { solveAlgorithmApi } from './services/apiService';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [initialArrayForForm, setInitialArrayForForm] = useState(null);
  const [initialQueriesForForm, setInitialQueriesForForm] = useState(null);

  // --- Visualization State ---
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means not started or initial state
  const [currentInputArrayForViz, setCurrentInputArrayForViz] = useState([]); // Store the array being visualized

  // Function to generate visualization steps
  // This re-simulates the logic for visualization purposes
  const generateVisualizationSteps = useCallback((inputArray) => {
    if (!inputArray || inputArray.length === 0) {
      setVisualizationSteps([]);
      setCurrentInputArrayForViz([]);
      return;
    }

    const steps = [];
    const n = inputArray.length;
    let conceptualBinaryArray = Array(n).fill(0);
    
    // Initial state
    steps.push({
      currentValueX: null, // Or "Initial"
      conceptualBinaryArray: [...conceptualBinaryArray],
      maxRunLength: 0,
      maxRunStartIndex: -1,
      originalArray: [...inputArray]
    });

    const valueIdxPairs = inputArray
      .map((value, index) => ({ value, originalIndex: index }))
      .sort((a, b) => a.value - b.value);

    let pairPointer = 0;
    const distinctSortedValues = [...new Set(inputArray)].sort((a,b) => a - b);

    for (const distinctValue of distinctSortedValues) {
      // Activate elements <= distinctValue
      for (let i = 0; i < n; i++) {
        if (inputArray[i] <= distinctValue) {
          conceptualBinaryArray[i] = 1;
        }
      }

      // Find max run of 1s in conceptualBinaryArray (simple O(n) scan for viz)
      let maxRun = 0;
      let currentRun = 0;
      let maxRunStart = -1;
      let currentRunStart = -1;

      for (let i = 0; i < n; i++) {
        if (conceptualBinaryArray[i] === 1) {
          if (currentRun === 0) currentRunStart = i;
          currentRun++;
        } else {
          if (currentRun > maxRun) {
            maxRun = currentRun;
            maxRunStart = currentRunStart;
          }
          currentRun = 0;
          currentRunStart = -1;
        }
      }
      if (currentRun > maxRun) { // Check for run at the end
        maxRun = currentRun;
        maxRunStart = currentRunStart;
      }
      
      steps.push({
        currentValueX: distinctValue,
        conceptualBinaryArray: [...conceptualBinaryArray],
        maxRunLength: maxRun,
        maxRunStartIndex: maxRunStart,
        originalArray: [...inputArray]
      });
    }
    
    setVisualizationSteps(steps);
    setCurrentInputArrayForViz([...inputArray]);
    setCurrentStepIndex(0); // Start at the initial step
  }, []);


  const handleCalculate = async (formData) => {
    setIsLoading(true);
    setApiError('');
    setResults([]);
    // Reset visualization for new calculation
    setVisualizationSteps([]);
    setCurrentStepIndex(-1);
    setCurrentInputArrayForViz([]);


    try {
      const responseData = await solveAlgorithmApi(formData);
      if (responseData && responseData.results) {
        const resultsWithContext = responseData.results.map(r => ({...r, originalInputArray: formData.array}));
        setResults(resultsWithContext);
        // Generate visualization steps after successful API call
        generateVisualizationSteps(formData.array); 
      } else {
        setResults([]);
        setApiError("Received an unexpected response format from the server.");
      }
    } catch (error) {
      setApiError(error.message || "An unexpected error occurred. Check console.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setResults([]);
    setApiError('');
    setInitialArrayForForm(null);
    setInitialQueriesForForm(null);
    // Clear visualization
    setVisualizationSteps([]);
    setCurrentStepIndex(-1);
    setCurrentInputArrayForViz([]);
  };

  const handleSelectExample = (exampleArray, exampleQueries) => {
    setInitialArrayForForm(exampleArray);
    setInitialQueriesForForm(exampleQueries);
    setResults([]); 
    setApiError('');
    // Clear visualization
    setVisualizationSteps([]);
    setCurrentStepIndex(-1);
    setCurrentInputArrayForViz([]);
  };

  const handleNextStep = () => {
    if (currentStepIndex < visualizationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const currentVizStepData = visualizationSteps[currentStepIndex] || {};


  return (
    <div className="App">
      <header className="App-header">
        <h1>Array Min-Max Query Solver</h1>
      </header>
      <main>
        <ExampleSelector onSelectExample={handleSelectExample} />
        <InputForm 
          onSubmit={handleCalculate} 
          isLoading={isLoading} 
          onClear={clearAll}
          initialArray={initialArrayForForm}
          initialQueries={initialQueriesForForm}
        />
        {isLoading && <div className="spinner"></div>}
        {apiError && <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>Error: {apiError}</p>}
        
        {!isLoading && !apiError && results.length > 0 && (
          <ResultsDisplay results={results} />
        )}

        {/* Visualization Section */}
        {visualizationSteps.length > 0 && !isLoading && (
          <>
            <ConceptualArrayDisplay 
              originalArray={currentVizStepData.originalArray}
              conceptualBinaryArray={currentVizStepData.conceptualBinaryArray}
              currentValueX={currentVizStepData.currentValueX}
              maxRunLength={currentVizStepData.maxRunLength}
              maxRunStartIndex={currentVizStepData.maxRunStartIndex}
            />
            <div className="viz-controls" style={{ marginTop: '10px', textAlign: 'center' }}>
              <button onClick={handlePrevStep} disabled={currentStepIndex <= 0}>Previous Step</button>
              <span style={{ margin: '0 10px' }}>
                Step {currentStepIndex + 1} of {visualizationSteps.length}
              </span>
              <button onClick={handleNextStep} disabled={currentStepIndex >= visualizationSteps.length - 1}>Next Step</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;