const API_BASE_URL = 'http://localhost:8080/api/algorithm'; // Adjust if your port or base path is different

export const solveAlgorithmApi = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.message) {
          errorMessage = errorBody.message;
        } else if (Array.isArray(errorBody) && errorBody.length > 0) {
            errorMessage = errorBody.join(', ');
        } else if (typeof errorBody === 'string') {
            errorMessage = errorBody;
        }
      } catch (e) {
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling solve API:", error);
    throw error; 
  }
};