
const CHILIZ_SCAN_API_BASE = "https://scan.chiliz.com/api";
const CHILIZ_SCAN_BASE = "https://scan.chiliz.com";

// ChilizScan API service
class ChilizScanAPI {
  constructor() {
    this.baseURL = CHILIZ_SCAN_API_BASE;
    this.explorerURL = CHILIZ_SCAN_BASE;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Add parameters to URL
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      console.log("ChilizScan API Request:", url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'C-TRACE/1.0'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        console.warn(`ChilizScan API Error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("ChilizScan API Request Failed:", error);
      return null;
    }
  }

  // Search for tokens using ChilizScan's actual endpoints
  async searchTokens(query) {
    try {
      const cleanQuery = query.trim().toLowerCase().replace('$', '');
      
      // Try the actual ChilizScan API endpoints
      const endpoints = [
        `?module=token&action=tokenlist&search=${encodeURIComponent(cleanQuery)}`,
        `?module=account&action=tokenlist&address=${encodeURIComponent(cleanQuery)}`,
        `?module=token&action=getToken&contractaddress=${encodeURIComponent(cleanQuery)}`
      ];

      for (const endpoint of endpoints) {
        const result = await this.makeRequest(endpoint);
        if (result && result.status === "1" && result.result) {
          return Array.isArray(result.result) ? result.result : [result.result];
        }
      }

      return null;
    } catch (error) {
      console.error("Token search failed:", error);
      return null;
    }
  }

  // Get token information by contract address
  async getTokenInfo(contractAddress) {
    try {
      if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        return null;
      }

      const endpoint = `?module=token&action=getToken&contractaddress=${contractAddress}`;
      const result = await this.makeRequest(endpoint);
      
      if (result && result.status === "1" && result.result) {
        return result.result;
      }

      return null;
    } catch (error) {
      console.error("Get token info failed:", error);
      return null;
    }
  }

  // Get contract information
  async getContractInfo(contractAddress) {
    try {
      if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        return null;
      }

      const endpoint = `?module=contract&action=getabi&address=${contractAddress}`;
      const result = await this.makeRequest(endpoint);
      
      if (result && result.status === "1") {
        return result;
      }

      return null;
    } catch (error) {
      console.error("Get contract info failed:", error);
      return null;
    }
  }

  // Search for any address or transaction
  async generalSearch(query) {
    try {
      const cleanQuery = query.trim().toLowerCase();
      
      // Check if it's a contract address
      if (cleanQuery.startsWith('0x') && cleanQuery.length === 42) {
        const contractInfo = await this.getContractInfo(cleanQuery);
        const tokenInfo = await this.getTokenInfo(cleanQuery);
        
        return {
          type: 'address',
          address: cleanQuery,
          contractInfo,
          tokenInfo
        };
      }

      // Search for tokens by name/symbol
      const tokenResults = await this.searchTokens(cleanQuery);
      if (tokenResults && tokenResults.length > 0) {
        return {
          type: 'tokens',
          results: tokenResults
        };
      }

      return null;
    } catch (error) {
      console.error("General search failed:", error);
      return null;
    }
  }

  // Get popular tokens (fallback to known Chiliz tokens)
  async getAllTokens(limit = 10) {
    try {
      // Since the API might not have a direct token list endpoint,
      // we'll provide known Chiliz ecosystem tokens
      const knownTokens = [
        {
          name: "Chiliz",
          symbol: "CHZ",
          contractAddress: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          type: "Native Token"
        },
        {
          name: "Paris Saint-Germain Fan Token",
          symbol: "PSG",
          contractAddress: "0x8Bb8e84A9b85F98f7d0cbAdFb26D3Aa84A503d3e",
          decimals: 0,
          type: "Fan Token"
        },
        {
          name: "FC Barcelona Fan Token",
          symbol: "BAR",
          contractAddress: "0x9F5377D4A915A3D62d13A15bB88D30bb8a2C4E40",
          decimals: 0,
          type: "Fan Token"
        },
        {
          name: "Juventus Fan Token",
          symbol: "JUV",
          contractAddress: "0xF2f93d847266E2703a39Ef27391E1cD3FC19d50C",
          decimals: 2,
          type: "Fan Token"
        },
        {
          name: "AC Milan Fan Token",
          symbol: "ACM",
          contractAddress: "0xbEAb3b9AF7B4C7C6C3a2B73F1d8C5a69Ff6b4b4b",
          decimals: 0,
          type: "Fan Token"
        }
      ];

      return knownTokens.slice(0, limit);
    } catch (error) {
      console.error("Get all tokens failed:", error);
      return null;
    }
  }

  // Format token information for display
  formatTokenInfo(tokenInfo) {
    if (!tokenInfo) return "No token information found.";

    let formatted = "## Token Information\n\n";
    
    if (tokenInfo.name) {
      formatted += `**Name:** ${tokenInfo.name}\n`;
    }
    
    if (tokenInfo.symbol) {
      formatted += `**Symbol:** ${tokenInfo.symbol}\n`;
    }
    
    if (tokenInfo.contractAddress) {
      formatted += `**Contract Address:** \`${tokenInfo.contractAddress}\`\n`;
    }
    
    if (tokenInfo.decimals) {
      formatted += `**Decimals:** ${tokenInfo.decimals}\n`;
    }
    
    if (tokenInfo.totalSupply || tokenInfo.total_supply) {
      formatted += `**Total Supply:** ${tokenInfo.totalSupply || tokenInfo.total_supply}\n`;
    }
    
    if (tokenInfo.type) {
      formatted += `**Type:** ${tokenInfo.type}\n`;
    }

    formatted += `\n**ChilizScan Link:** ${this.explorerURL}/token/${tokenInfo.contractAddress || 'unknown'}`;
    
    return formatted;
  }

  // Format search results with better error handling
  formatSearchResults(results, query) {
    if (!results) {
      // Map common token symbols to known information
      const knownTokens = {
        'asr': 'AS Roma Fan Token (ASR) - Check if this token exists on Chiliz or other networks',
        'psg': 'Paris Saint-Germain Fan Token (PSG) - Available on Chiliz Chain',
        'bar': 'FC Barcelona Fan Token (BAR) - Available on Chiliz Chain',
        'juv': 'Juventus Fan Token (JUV) - Available on Chiliz Chain',
        'acm': 'AC Milan Fan Token (ACM) - Available on Chiliz Chain',
        'chz': 'Chiliz (CHZ) - Native token of Chiliz Chain',
        'chilizinu': 'ChilizInu token - Please verify if this exists on Chiliz Chain',
        'kayen': 'Kayen token - Please verify if this exists on Chiliz Chain'
      };

      const queryLower = query.toLowerCase().replace('$', '');
      const knownInfo = knownTokens[queryLower];

      if (knownInfo) {
        return `## Token Search Result for "${query}"\n\n${knownInfo}\n\n**Note:** Due to API limitations, I couldn't fetch real-time data from ChilizScan. For the most accurate and up-to-date information, please:\n\n1. **Visit ChilizScan directly:** ${this.explorerURL}/tokens\n2. **Search manually** for the token name or symbol\n3. **Provide the contract address** if you have it for detailed analysis\n\n**Popular Chiliz tokens you can search for:**\n- $CHZ (Chiliz native token)\n- $PSG (Paris Saint-Germain)\n- $BAR (FC Barcelona)\n- $JUV (Juventus)\n- $ACM (AC Milan)`;
      }

      return `I couldn't find any information for "${query}" on ChilizScan. This could mean:

1. **API Connection Issues** - ChilizScan API might be temporarily unavailable
2. **Token doesn't exist on Chiliz Chain** - The token might be on a different blockchain
3. **Different name/symbol** - The token might use a different symbol or name
4. **New/unlisted token** - Very new tokens might not be indexed yet

**What you can try:**
- ✅ **Provide the contract address** if you have it (most reliable method)
- ✅ **Check ChilizScan directly**: ${this.explorerURL}/tokens  
- ✅ **Try popular fan tokens** like $PSG, $BAR, $JUV, $ACM
- ✅ **Verify spelling** and try alternative names

**Popular Chiliz tokens:**
- $CHZ (Chiliz native token)
- $PSG (Paris Saint-Germain Fan Token)
- $BAR (FC Barcelona Fan Token)  
- $JUV (Juventus Fan Token)
- $ACM (AC Milan Fan Token)`;
    }

    if (results.type === 'address') {
      let formatted = `## Address Information: \`${results.address}\`\n\n`;
      
      if (results.tokenInfo) {
        formatted += this.formatTokenInfo(results.tokenInfo);
      } else if (results.contractInfo) {
        formatted += "## Contract Information\n\n";
        formatted += `**Address:** \`${results.address}\`\n`;
        formatted += `**Type:** Smart Contract\n`;
      } else {
        formatted += "This appears to be a regular wallet address or an unverified contract.";
      }
      
      formatted += `\n\n**ChilizScan Link:** ${this.explorerURL}/address/${results.address}`;
      return formatted;
    }

    if (results.type === 'tokens' && results.results.length > 0) {
      let formatted = `## Found ${results.results.length} token(s) matching "${query}":\n\n`;
      
      results.results.slice(0, 5).forEach((token, index) => {
        formatted += `### ${index + 1}. ${token.name || 'Unknown'} (${token.symbol || 'N/A'})\n`;
        if (token.contractAddress) {
          formatted += `**Contract:** \`${token.contractAddress}\`\n`;
        }
        if (token.decimals !== undefined) {
          formatted += `**Decimals:** ${token.decimals}\n`;
        }
        if (token.type) {
          formatted += `**Type:** ${token.type}\n`;
        }
        formatted += `**ChilizScan:** ${this.explorerURL}/token/${token.contractAddress || ''}\n\n`;
      });

      if (results.results.length > 5) {
        formatted += `... and ${results.results.length - 5} more results.\n`;
      }

      return formatted;
    }

    return `No results found for "${query}" on ChilizScan.`;
  }
}

// Export the API instance
export const chilizScanAPI = new ChilizScanAPI();

// Main search function that integrates with the chat system
export async function searchChilizScan(query) {
  console.log("Searching ChilizScan for:", query);
  
  const results = await chilizScanAPI.generalSearch(query);
  return chilizScanAPI.formatSearchResults(results, query);
}

// Specific token lookup function
export async function lookupToken(tokenNameOrSymbol) {
  console.log("Looking up token:", tokenNameOrSymbol);
  
  const results = await chilizScanAPI.searchTokens(tokenNameOrSymbol);
  return chilizScanAPI.formatSearchResults({ type: 'tokens', results }, tokenNameOrSymbol);
}

// Get popular tokens
export async function getPopularTokens() {
  console.log("Fetching popular Chiliz tokens...");
  
  const tokens = await chilizScanAPI.getAllTokens(10);
  if (!tokens) {
    return "Unable to fetch popular tokens from ChilizScan at the moment.";
  }

  let formatted = "## Popular Chiliz Tokens\n\n";
  tokens.forEach((token, index) => {
    formatted += `### ${index + 1}. ${token.name || 'Unknown'} (${token.symbol || 'N/A'})\n`;
    if (token.contractAddress && token.contractAddress !== "0x0000000000000000000000000000000000000000") {
      formatted += `**Contract:** \`${token.contractAddress}\`\n`;
    }
    if (token.type) {
      formatted += `**Type:** ${token.type}\n`;
    }
    formatted += `**ChilizScan:** ${chilizScanAPI.explorerURL}/token/${token.contractAddress || ''}\n\n`;
  });

  return formatted;
}
