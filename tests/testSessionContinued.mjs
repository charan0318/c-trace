const API_BASE_URL = "https://nebula-api.thirdweb.com";
const SECRET_KEY = process.env.NEBULA_API_KEY;


// The existing session_id
const sessionId = "e4fd75fd-2189-4bdc-ad2a-255bf09bebe9";

// Utility function to make API requests
async function apiRequest(endpoint, method, body = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": SECRET_KEY,
    },
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Response Error:", errorText);
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Ask a follow-up question in the same session
async function askFollowUpQuestion(userMessage) {
  const response = await apiRequest("/chat", "POST", {
    message: userMessage,
    session_id: sessionId,
  });

  return response.message; // Nebula's reply
}

// Test the script
(async () => {
  try {
    const followUpQuestion = "What functions does this contract have?"; // Replace with your follow-up question
    console.log(`Asking Nebula: "${followUpQuestion}"`);

    const response = await askFollowUpQuestion(followUpQuestion);
    console.log("Nebula's Response:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
