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
    'asr': `**ASR (AS Roma Fan Token)**

ASR is the official fan token of **AS Roma**, one of Italy's most prestigious football clubs based in Rome. 

**What it represents:**
- 🏟️ **Digital connection** between AS Roma and their global fanbase
- 🗳️ **Voting rights** on club decisions (jersey designs, stadium music, etc.)
- 🎁 **Exclusive experiences** like meet & greets, VIP events, and stadium tours
- 🏆 **Rewards and gamification** through the Socios.com platform

**Key details:**
- Built on **Chiliz Chain** (Chain ID: 88888)
- Part of the **Socios.com ecosystem**
- Enables fans to have a **voice in club decisions**
- **Tradeable** on various cryptocurrency exchanges

ASR represents the future of **fan engagement** in sports, giving supporters worldwide a stake in their favorite team's non-critical decisions.`,

    'roma': `**ASR (AS Roma Fan Token)**

ASR is the official fan token of **AS Roma**, one of Italy's most prestigious football clubs based in Rome. 

**What it represents:**
- 🏟️ **Digital connection** between AS Roma and their global fanbase
- 🗳️ **Voting rights** on club decisions (jersey designs, stadium music, etc.)
- 🎁 **Exclusive experiences** like meet & greets, VIP events, and stadium tours
- 🏆 **Rewards and gamification** through the Socios.com platform

**Key details:**
- Built on **Chiliz Chain** (Chain ID: 88888)
- Part of the **Socios.com ecosystem**
- Enables fans to have a **voice in club decisions**
- **Tradeable** on various cryptocurrency exchanges

ASR represents the future of **fan engagement** in sports, giving supporters worldwide a stake in their favorite team's non-critical decisions.`,

    'psg': `**PSG (Paris Saint-Germain Fan Token)**

PSG is the official fan token of **Paris Saint-Germain**, one of the world's most valuable football clubs.

**What it represents:**
- 🏟️ **Digital connection** to PSG's global fanbase
- 🗳️ **Fan voting** on club polls and decisions
- ⭐ **Exclusive access** to PSG experiences and content
- 🎮 **Gamification** and rewards through Socios.com

Built on **Chiliz Chain** as part of the revolutionary **fan engagement ecosystem**.`,

    'bar': `**BAR (FC Barcelona Fan Token)**

BAR is the official fan token of **FC Barcelona**, one of the most successful football clubs in history.

**What it represents:**
- 🏟️ **Connection** to Barça's massive global fanbase
- 🗳️ **Voting power** on club decisions and polls
- 🎁 **VIP experiences** and exclusive content access
- 🏆 **Rewards** through fan engagement activities

Built on **Chiliz Chain** to revolutionize how fans interact with their beloved club.`,

    'juv': `**JUV (Juventus Fan Token)**

JUV is the official fan token of **Juventus FC**, Italy's most successful football club.

**What it represents:**
- 🏟️ **Digital fan engagement** with the Bianconeri
- 🗳️ **Voting rights** on various club decisions
- ⭐ **Exclusive experiences** and VIP access
- 🎮 **Gamified rewards** through Socios platform

Built on **Chiliz Chain** to connect Juventus with fans worldwide.`,

    'acm': `**ACM (AC Milan Fan Token)**

ACM is the official fan token of **AC Milan**, one of Italy's most historic football clubs.

**What it represents:**
- 🏟️ **Digital connection** to the Rossoneri legacy
- 🗳️ **Fan voting** on club-related decisions
- 🎁 **Exclusive Milan experiences** and content
- 🏆 **Rewards** for fan engagement and loyalty

Built on **Chiliz Chain** as part of the modern fan engagement revolution.`,

    'chz': `**CHZ (Chiliz)**

CHZ is the native cryptocurrency of the **Chiliz blockchain** and the fuel of the sports fan token ecosystem.

**What it represents:**
- ⛽ **Gas token** for transactions on Chiliz Chain
- 🎫 **Currency** to purchase fan tokens on Socios.com
- 🏗️ **Foundation** of the world's first sports-focused blockchain
- 🌐 **Bridge** between traditional sports and crypto innovation

**Key facts:**
- Powers the **entire fan token ecosystem**
- Used by **100+ sports teams** worldwide
- **Native token** of Chiliz Chain (Chain ID: 88888)
- **Utility token** for sports fan engagement`,

    'chiliz': `**CHZ (Chiliz)**

CHZ is the native cryptocurrency of the **Chiliz blockchain** and the fuel of the sports fan token ecosystem.

**What it represents:**
- ⛽ **Gas token** for transactions on Chiliz Chain
- 🎫 **Currency** to purchase fan tokens on Socios.com
- 🏗️ **Foundation** of the world's first sports-focused blockchain
- 🌐 **Bridge** between traditional sports and crypto innovation

**Key facts:**
- Powers the **entire fan token ecosystem**
- Used by **100+ sports teams** worldwide
- **Native token** of Chiliz Chain (Chain ID: 88888)
- **Utility token** for sports fan engagement`,

    'barcelona': `**BAR (FC Barcelona Fan Token)**

BAR is the official fan token of **FC Barcelona**, one of the most successful football clubs in history.

**What it represents:**
- 🏟️ **Connection** to Barça's massive global fanbase
- 🗳️ **Voting power** on club decisions and polls
- 🎁 **VIP experiences** and exclusive content access
- 🏆 **Rewards** through fan engagement activities

Built on **Chiliz Chain** to revolutionize how fans interact with their beloved club.`,

    'psg': `**PSG (Paris Saint-Germain Fan Token)**

PSG is the official fan token of **Paris Saint-Germain**, one of the world's most valuable football clubs.

**What it represents:**
- 🏟️ **Digital connection** to PSG's global fanbase
- 🗳️ **Fan voting** on club polls and decisions
- ⭐ **Exclusive access** to PSG experiences and content
- 🎮 **Gamification** and rewards through Socios.com

Built on **Chiliz Chain** as part of the revolutionary **fan engagement ecosystem**.`,

    'juventus': `**JUV (Juventus Fan Token)**

JUV is the official fan token of **Juventus FC**, Italy's most successful football club.

**What it represents:**
- 🏟️ **Digital fan engagement** with the Bianconeri
- 🗳️ **Voting rights** on various club decisions
- ⭐ **Exclusive experiences** and VIP access
- 🎮 **Gamified rewards** through Socios platform

Built on **Chiliz Chain** to connect Juventus with fans worldwide.`,

    'milan': `**ACM (AC Milan Fan Token)**

ACM is the official fan token of **AC Milan**, one of Italy's most historic football clubs.

**What it represents:**
- 🏟️ **Digital connection** to the Rossoneri legacy
- 🗳️ **Fan voting** on club-related decisions
- 🎁 **Exclusive Milan experiences** and content
- 🏆 **Rewards** for fan engagement and loyalty

Built on **Chiliz Chain** as part of the modern fan engagement revolution.`,

    'pepper': `**PEPPER Token**

PEPPER is a community token on the **Chiliz Chain** ecosystem.

**What it represents:**
- 🌶️ **Community-driven** token project
- 🔥 **Spicy** addition to the Chiliz ecosystem
- 💎 **Meme token** with community focus
- 🚀 **Grassroots** project on Chiliz Chain

Built on **Chiliz Chain** as part of the growing DeFi and community token movement.`,

    'chilizinu': `**CHILIZINU (ChilizInu)**

CHILIZINU is a meme token inspired by the popular "Inu" trend, built on **Chiliz Chain**.

**What it represents:**
- 🐕 **Meme token** combining Chiliz ecosystem with Inu culture
- 🌶️ **Community project** on Chiliz Chain
- 💎 **Experimental token** in the Chiliz DeFi space
- 🚀 **Fan-driven** cryptocurrency project

Built on **Chiliz Chain** to bring meme culture to the sports blockchain ecosystem.`,

    'kayen': `**KAYEN Token**

KAYEN is a community token project on the **Chiliz Chain** ecosystem.

**What it represents:**
- 🎯 **Community-focused** token project
- 🔥 **Innovation** in the Chiliz ecosystem
- 💎 **Experimental** DeFi project
- 🌐 **Decentralized** community initiative

Built on **Chiliz Chain** as part of the expanding token ecosystem beyond sports.`,

    'socios': `**Socios.com Platform**

Socios.com is the leading **fan engagement platform** powered by Chiliz blockchain.

**What it represents:**
- 🏟️ **Global platform** for sports fan tokens
- 🗳️ **Fan voting** and decision-making hub
- 🎁 **Exclusive experiences** marketplace
- 🌐 **Bridge** between fans and teams worldwide

**Key features:**
- **Fan token trading** and management
- **Interactive polls** and team decisions
- **Rewards and gamification** systems
- **VIP experiences** and exclusive content`,

    'fantoken': `**Fan Tokens Ecosystem**

Fan tokens are **digital assets** that give sports fans voting rights and exclusive experiences with their favorite teams.

**What they represent:**
- 🗳️ **Voting power** on team decisions
- 🎁 **Exclusive access** to experiences
- 🏟️ **Digital connection** to global fanbase
- 💎 **Collectible value** and trading opportunities

**Built on Chiliz Chain** to revolutionize fan engagement in sports.`,

    'fantokens': `**Fan Tokens Ecosystem**

Fan tokens are **digital assets** that give sports fans voting rights and exclusive experiences with their favorite teams.

**What they represent:**
- 🗳️ **Voting power** on team decisions
- 🎁 **Exclusive access** to experiences
- 🏟️ **Digital connection** to global fanbase
- 💎 **Collectible value** and trading opportunities

**Built on Chiliz Chain** to revolutionize fan engagement in sports.`
  };

  return explanations[symbol] || null;
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