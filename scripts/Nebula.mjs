const API_BASE_URL = "https://nebula-api.thirdweb.com";
const SECRET_KEY = "GD1Dt0y6UjQm6gQ5oXlIsSTiLkeVpxTOVImHshvnecRP9IHc-EinIENOBl4BZVYu1EYbGYtWxIjBHKLeJY3kTw";

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

// Create a new Session
async function createSession(title = "Smart Contract Explorer") {
  const response = await apiRequest("/session", "POST", { title });
  const sessionId = response.result.id;

  return sessionId; // Return the session ID
}

// Query the smart contract
async function queryContract(contractAddress, chainId, sessionId) {
  // Dynamically create the message for the query
  const message = `
    Give me the deatils of this contract and provide a structured list of all functions available in the smart contract deployed at address ${contractAddress} on chain ${chainId}. The response must strictly follow this format:

    ### Contract Details:
    - **Name:** <contractName>
    - **Address:** <contractAddress>
    - **Chain ID:** <chainId>
    - **Blockchain:** <blockchainName>

    ### Read-only Functions:
    1. **\`<functionName(parameters)\`**
       - **Returns:** <returnType> (e.g., uint256, string, bool, etc.)
       - **Description:** <brief description of what the function does>

    ### Write-able Functions:
    1. **\`<functionName(parameters)\`**
       - **Returns:** <returnType> (if applicable)
       - **Description:** <brief description of what the function does>
       - **Payable:** <true/false> (if the function can accept Ether).
       - **Parameters:** <parameterName> <parameterType> <parameterDescription>

    If no functions exist in a category, include the section with "None available." Ensure the response is accurate, concise, and excludes unrelated details. If the contract implements interfaces (e.g., ERC20, ERC721), include their functions as well.
  `.trim();

  const requestBody = {
    message,
    session_id: sessionId,
    context_filter: {
      chain_ids: [chainId.toString()],
      contract_addresses: [contractAddress],
    },
  };

  console.log("Query Contract Request Body:", requestBody);

  // Make the API request
  const response = await apiRequest("/chat", "POST", requestBody);

  return response.message; // Return the structured response from Nebula
}

// Handle user messages (follow-up questions)
async function handleUserMessage(
  userMessage,
  sessionId,
  chainId,
  contractAddress
) {
  // Check if this is an address analysis request
  const addressPattern = /(?:analyze|history|transactions|activity).*?(0x[a-fA-F0-9]{40})|(?:0x[a-fA-F0-9]{40}).*?(?:analyze|history|transactions|activity)/i;
  const addressMatch = userMessage.match(addressPattern);
  const directAddressMatch = userMessage.match(/(0x[a-fA-F0-9]{40})/);
  
  // If we detect an address analysis request on Chiliz Chain
  if ((addressMatch || (directAddressMatch && (userMessage.toLowerCase().includes('analyze') || userMessage.toLowerCase().includes('history') || userMessage.toLowerCase().includes('transaction')))) && chainId === "88888") {
    const addressToAnalyze = addressMatch ? addressMatch[1] || addressMatch[2] : directAddressMatch[1];
    
    if (addressToAnalyze) {
      console.log(`🔍 Detected address analysis request: ${addressToAnalyze} on Chiliz Chain`);
      
      try {
        const analysisResult = await analyzeAddressHistory(addressToAnalyze);
        return analysisResult;
      } catch (error) {
        console.error("Error in address analysis:", error);
        // Fall through to regular Nebula query
      }
    }
  }

  // Check if this is a token search query
  const tokenSearchPattern = /(?:\$([A-Z]+)|([A-Z]{2,10})\s+token|token\s+([A-Z]{2,10})|search\s+for\s+([A-Z]{2,10})|find\s+([A-Z]{2,10}))/i;
  const tokenMatch = userMessage.match(tokenSearchPattern);
  
  // Extract token symbol from various patterns
  let tokenSymbol = null;
  if (tokenMatch) {
    tokenSymbol = tokenMatch[1] || tokenMatch[2] || tokenMatch[3] || tokenMatch[4] || tokenMatch[5];
  }

  // Also check for specific token names mentioned in queries
  const lowerMessage = userMessage.toLowerCase();
  const tokenNames = ['chilizinu', 'chzinu', 'kayen', 'asr', 'psg', 'bar', 'juv', 'acm'];
  let foundTokenName = null;
  
  for (const tokenName of tokenNames) {
    if (lowerMessage.includes(tokenName)) {
      foundTokenName = tokenName;
      break;
    }
  }

  // If we detected a token search, try ChilizScan first
  if ((tokenSymbol && chainId === "88888") || (foundTokenName && chainId === "88888")) {
    console.log(`🔍 Detected token search: ${tokenSymbol || foundTokenName} on Chiliz Chain`);
    
    try {
      const searchTerm = tokenSymbol || foundTokenName;
      const chilizScanResult = await searchChilizScan(searchTerm);
      
      // If ChilizScan found results, return them
      if (chilizScanResult && !chilizScanResult.includes("couldn't find") && !chilizScanResult.includes("No results found")) {
        console.log("✅ ChilizScan found results");
        return chilizScanResult;
      }
      
      // If ChilizScan didn't find anything, try lookup with different variations
      const lookupResult = await lookupToken(searchTerm);
      if (lookupResult && !lookupResult.includes("couldn't find") && !lookupResult.includes("No results found")) {
        console.log("✅ ChilizScan lookup found results");
        return lookupResult;
      }
      
      // If still no results, provide enhanced error message
      console.log("❌ No results from ChilizScan");
      return `I searched ChilizScan for "${searchTerm}" but couldn't find this token on Chiliz Chain.

**Possible reasons:**
1. **Token doesn't exist on Chiliz Chain** - This token might be on a different blockchain
2. **Different symbol/name** - The token might use a different symbol or name
3. **New/unlisted token** - Very new tokens might not be indexed yet
4. **Typo in search** - Please verify the spelling

**What you can try:**
- ✅ **Provide the contract address** if you have it (most reliable method)
- ✅ **Check official sources** like the project's website or social media
- ✅ **Try alternative spellings** or the full token name
- ✅ **Search on ChilizScan directly**: https://scan.chiliz.com/tokens

**Popular Chiliz tokens you can search for:**
- $CHZ (Chiliz native token)
- $PSG (Paris Saint-Germain Fan Token)
- $BAR (FC Barcelona Fan Token)
- $JUV (Juventus Fan Token)
- $ACM (AC Milan Fan Token)

Would you like me to search for any of these instead, or do you have a contract address to check?`;
      
    } catch (error) {
      console.error("Error in ChilizScan search:", error);
      // Fall through to regular Nebula query
    }
  }

  // For non-token searches or if ChilizScan failed, use regular Nebula query
  const response = await apiRequest("/chat", "POST", {
    message: userMessage,
    session_id: sessionId,
    context_filter: {
      chain_ids: [chainId.toString()],
      contract_addresses: [contractAddress],
    },
  });

  return response.message; // Nebula's reply
}

async function updateSession(sessionId, title, isPublic) {
  const requestBody = {
    title,
    is_public: isPublic,
  };

  const response = await apiRequest(
    `/session/${sessionId}`,
    "PUT",
    requestBody
  );

  console.log(`Session ${sessionId} updated:`, response);
  return response; // Returns the updated session details
}

async function clearSession(sessionId) {
  const response = await apiRequest(`/session/${sessionId}/clear`, "POST");

  console.log(`Session ${sessionId} cleared.`);
  return response; // Returns a confirmation or updated session status
}

async function deleteSession(sessionId) {
  const response = await apiRequest(`/session/${sessionId}`, "DELETE");

  console.log(`Session ${sessionId} deleted.`);
  return response; // Returns a confirmation
}

// Function to execute transaction

async function executeCommand(
  message,
  signerWalletAddress,
  userId = "default-user",
  stream = false,
  chainId,
  contractAddress,
  sessionId
) {
  const requestBody = {
    message,
    user_id: userId,
    stream,
    session_id: sessionId,
    execute_config: {
      mode: "client", // Only client mode is supported
      signer_wallet_address: signerWalletAddress,
    },
    context_filter: {
      chain_ids: [chainId.toString()],
      contract_addresses: [contractAddress],
    },
  };

  console.log("Execute Command Request Body:", requestBody);

  const response = await apiRequest("/execute", "POST", requestBody);

  console.log("Execute Command Response:", response);

  return response; // Return the full response including message and actions
}

// Import ChilizScan integration
import { searchChilizScan, lookupToken, getPopularTokens, analyzeAddressHistory } from './ChilizScan.mjs';

export {
  createSession,
  queryContract,
  handleUserMessage,
  updateSession,
  clearSession,
  deleteSession,
  executeCommand,
  // Export ChilizScan functions
  searchChilizScan,
  lookupToken,
  getPopularTokens,
  analyzeAddressHistory,
};