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
  // Check if this is a transaction hash analysis request
  const txHashPattern = /(0x[a-fA-F0-9]{64})/;
  const txHashMatch = userMessage.match(txHashPattern);

  if (txHashMatch && chainId === "88888") {
    const txHash = txHashMatch[1];
    console.log(`🔍 Detected transaction analysis request: ${txHash} on Chiliz Chain`);

    try {
      const analysisResult = await analyzeTransaction(txHash);
      return analysisResult;
    } catch (error) {
      console.error("Error in transaction analysis:", error);
    }
  }

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

  // Check if this is a token holder analysis request
  const holderPattern = /(?:holders?|distribution).*?(0x[a-fA-F0-9]{40})|(?:0x[a-fA-F0-9]{40}).*?(?:holders?|distribution)/i;
  const holderMatch = userMessage.match(holderPattern);

  if (holderMatch && chainId === "88888") {
    const contractAddr = holderMatch[1] || holderMatch[2];
    console.log(`🔍 Detected token holder analysis request: ${contractAddr} on Chiliz Chain`);

    try {
      const analysisResult = await analyzeTokenHolders(contractAddr);
      return analysisResult;
    } catch (error) {
      console.error("Error in token holder analysis:", error);
    }
  }

  // Check if this is a "what is" explanatory query first (HIGHEST PRIORITY)
  const whatIsPattern = /^what\s+is\s+([a-zA-Z]+)(?:\s+token)?\??$/i;
  const aboutPattern = /^(?:tell me about|about|explain|describe)\s+([a-zA-Z]+)(?:\s+token)?\??$/i;
  const infoPattern = /^([a-zA-Z]+)\s+(?:info|information|details)\??$/i;

  const whatIsMatch = userMessage.match(whatIsPattern);
  const aboutMatch = userMessage.match(aboutPattern);
  const infoMatch = userMessage.match(infoPattern);

  if ((whatIsMatch || aboutMatch || infoMatch) && chainId === "88888") {
    const symbol = (whatIsMatch?.[1] || aboutMatch?.[1] || infoMatch?.[1])?.toLowerCase();
    if (symbol) {
      const explanation = getTokenExplanation(symbol);
      if (explanation) {
        console.log(`🔍 Providing explanation for: ${symbol}`);
        return explanation;
      }
    }
  }

  // Check if this is a token search query for technical details (LOWER PRIORITY)
  const tokenSearchPattern = /(?:contract\s+address|address\s+for|find\s+contract|search\s+contract|technical\s+details|token\s+details|holders|supply)\s*(?:for|of)?\s*([a-zA-Z]+)|(?:\$([A-Z]+))|(?:search\s+for\s+([A-Z]{2,10})\s+(?:contract|address|details))/i;
  const tokenMatch = userMessage.match(tokenSearchPattern);

  // Extract token symbol from technical search patterns only
  let tokenSymbol = null;
  if (tokenMatch) {
    tokenSymbol = tokenMatch[1] || tokenMatch[2] || tokenMatch[3];
  }

  // Check for specific technical token searches (contract/address related)
  const lowerMessage = userMessage.toLowerCase();
  const technicalKeywords = ['contract', 'address', 'holders', 'supply', 'technical', 'details'];
  const hasTechnicalKeyword = technicalKeywords.some(keyword => lowerMessage.includes(keyword));

  // Only proceed with ChilizScan if it's a technical query
  const tokenNames = ['chilizinu', 'chzinu', 'kayen', 'asr', 'psg', 'bar', 'juv', 'acm'];
  let foundTokenName = null;

  if (hasTechnicalKeyword) {
    for (const tokenName of tokenNames) {
      if (lowerMessage.includes(tokenName)) {
        foundTokenName = tokenName;
        break;
      }
    }
  }

  // If we detected a technical token search, try ChilizScan
  if (((tokenSymbol && chainId === "88888") || (foundTokenName && chainId === "88888")) && hasTechnicalKeyword) {
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

// Token explanation function with comprehensive coverage
function getTokenExplanation(symbol) {
  const explanations = {
    'chz': `**Chiliz (CHZ)** is the native cryptocurrency of the Chiliz blockchain ecosystem.

🏆 **Key Information:**
- **Contract Address:** Native Token (no contract address needed)
- **Native Token:** Powers the entire Chiliz Chain ecosystem
- **Use Cases:** Gas fees, staking, fan token creation, governance
- **Fan Token Platform:** Enables sports teams to create fan tokens
- **Blockchain:** Chiliz Chain (Chain ID: 88888)

💡 **What makes CHZ special:**
- Bridge between sports and blockchain technology
- Powers fan engagement through fan tokens
- Used by major sports teams like FC Barcelona, PSG, Juventus
- Enables voting on team decisions and exclusive experiences`,

    'psg': `**Paris Saint-Germain Fan Token (PSG)** is the official fan token of Paris Saint-Germain Football Club.

🏆 **Key Information:**
- **Contract Address:** \`0x8f4bE8C71C67D7b1C4935A3E0f89580C03F7F1D2\`
- **Team:** Paris Saint-Germain FC
- **Symbol:** PSG
- **Type:** Fan Token on Chiliz Chain
- **Supply:** Limited edition with utility features

💡 **Fan Token Benefits:**
- Vote on club decisions and polls
- Access exclusive content and experiences
- VIP rewards and merchandise discounts
- Direct engagement with the club`,

    'bar': `**FC Barcelona Fan Token (BAR)** is the official fan token of FC Barcelona Football Club.

🏆 **Key Information:**
- **Contract Address:** \`0x9F5377D4A915A3D62d13A15bB88D30bb8a2C4E40\`
- **Team:** FC Barcelona
- **Symbol:** BAR  
- **Type:** Fan Token on Chiliz Chain
- **Supply:** Limited edition with utility features

💡 **Fan Token Benefits:**
- Vote on club decisions (jersey designs, celebrations, etc.)
- Access exclusive content and experiences
- VIP rewards and merchandise discounts
- Connect with other Barça fans globally`,

    'juv': `**Juventus Fan Token (JUV)** is the official fan token of Juventus Football Club.

🏆 **Key Information:**
- **Contract Address:** \`0xF2f93d847266E2703a39Ef27391E1cD3FC19d50C\`
- **Team:** Juventus FC
- **Symbol:** JUV
- **Type:** Fan Token on Chiliz Chain
- **Supply:** Limited edition with utility features

💡 **Fan Token Benefits:**
- Vote on club decisions and initiatives  
- Access exclusive Juventus content
- VIP experiences and rewards
- Special merchandise and discounts`,

    'acm': `**AC Milan Fan Token (ACM)** is the official fan token of AC Milan Football Club.

🏆 **Key Information:**
- **Contract Address:** \`0xbEAb3b9AF7B4C7C6C3a2B73F1d8C5a69Ff6b4b4b\`
- **Team:** AC Milan
- **Symbol:** ACM
- **Type:** Fan Token on Chiliz Chain
- **Supply:** Limited edition with utility features

💡 **Fan Token Benefits:**
- Vote on club decisions and polls
- Access exclusive AC Milan content
- VIP experiences and rewards
- Special merchandise opportunities`,

    'asr': `**AS Roma Fan Token (ASR)** is the official fan token of AS Roma Football Club.

🏆 **Key Information:**
- **Contract Address:** \`0xb8C77C860e8E9F6d29554fB0E86F54b5F749d4e3\`
- **Team:** AS Roma
- **Symbol:** ASR
- **Type:** Fan Token on Chiliz Chain
- **Supply:** Limited edition with utility features

💡 **Fan Token Benefits:**
- Vote on club decisions and initiatives
- Access exclusive Roma content and experiences
- VIP rewards and merchandise
- Connect with the global Roma community`
  };

  return explanations[symbol.toLowerCase()] || null;
}

// Import ChilizScan integration
import { 
  searchChilizScan, 
  lookupToken, 
  analyzeAddressHistory, 
  analyzeTransaction, 
  analyzeTokenHolders 
} from './ChilizScan.mjs';

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
  analyzeAddressHistory,
  analyzeTransaction,
  analyzeTokenHolders,
};