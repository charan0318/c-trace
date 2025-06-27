
const CHILIZ_SCAN_API_BASE = "https://scan.chiliz.com/api";
const CHILIZ_SCAN_BASE = "https://scan.chiliz.com";

// ChilizScan API service
class ChilizScanAPI {
  constructor() {
    this.baseURL = CHILIZ_SCAN_API_BASE;
    this.explorerURL = CHILIZ_SCAN_BASE;
  }

  async makeRequest(queryParams) {
    try {
      const url = `${this.baseURL}${queryParams}`;
      
      console.log("ChilizScan API Request:", url);

      const response = await fetch(url, {
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
      console.log("ChilizScan API Response:", data);
      return data;
    } catch (error) {
      console.error("ChilizScan API Request Failed:", error);
      return null;
    }
  }

  // Search for tokens by name/symbol using the correct API
  async searchTokens(query) {
    try {
      const cleanQuery = query.trim().toLowerCase().replace('$', '');
      
      // First try to get token by symbol - this is the most reliable method
      if (/^[a-zA-Z]+$/.test(cleanQuery)) {
        // Search through token holders to find tokens (indirect method)
        const tokenListResult = await this.makeRequest(`?module=account&action=tokenlist&address=0x0000000000000000000000000000000000000000`);
        
        if (tokenListResult && tokenListResult.status === "1" && Array.isArray(tokenListResult.result)) {
          const matchingTokens = tokenListResult.result.filter(token => 
            token.symbol && token.symbol.toLowerCase() === cleanQuery
          );
          
          if (matchingTokens.length > 0) {
            return matchingTokens;
          }
        }
      }

      // If direct search fails, check known tokens
      const knownTokens = await this.getKnownTokenInfo(cleanQuery);
      if (knownTokens) {
        return [knownTokens];
      }

      return null;
    } catch (error) {
      console.error("Token search failed:", error);
      return null;
    }
  }

  // Get known token information for popular Chiliz tokens
  async getKnownTokenInfo(symbol) {
    const knownTokens = {
      'chz': {
        name: "Chiliz",
        symbol: "CHZ", 
        contractAddress: "0x0000000000000000000000000000000000000000",
        decimals: "18",
        type: "Native Token"
      },
      'psg': {
        name: "Paris Saint-Germain Fan Token",
        symbol: "PSG",
        contractAddress: "0x8Bb8e84A9b85F98f7d0cbAdFb26D3Aa84A503d3e",
        decimals: "0",
        type: "Fan Token"
      },
      'bar': {
        name: "FC Barcelona Fan Token", 
        symbol: "BAR",
        contractAddress: "0x9F5377D4A915A3D62d13A15bB88D30bb8a2C4E40",
        decimals: "0",
        type: "Fan Token"
      },
      'juv': {
        name: "Juventus Fan Token",
        symbol: "JUV",
        contractAddress: "0xF2f93d847266E2703a39Ef27391E1cD3FC19d50C", 
        decimals: "2",
        type: "Fan Token"
      },
      'acm': {
        name: "AC Milan Fan Token",
        symbol: "ACM",
        contractAddress: "0xbEAb3b9AF7B4C7C6C3a2B73F1d8C5a69Ff6b4b4b",
        decimals: "0", 
        type: "Fan Token"
      },
      'asr': {
        name: "AS Roma Fan Token",
        symbol: "ASR",
        contractAddress: "0xb8C77C860e8E9F6d29554fB0E86F54b5F749d4e3",
        decimals: "2",
        type: "Fan Token"
      }
    };

    const tokenInfo = knownTokens[symbol.toLowerCase()];
    if (tokenInfo) {
      // Try to get live data from the API
      const liveData = await this.getTokenInfo(tokenInfo.contractAddress);
      if (liveData && liveData.status === "1") {
        return { ...tokenInfo, ...liveData.result };
      }
      return tokenInfo;
    }
    
    return null;
  }

  // Get token information by contract address
  async getTokenInfo(contractAddress) {
    try {
      if (!contractAddress || (!contractAddress.startsWith('0x') && contractAddress !== "0x0000000000000000000000000000000000000000")) {
        return null;
      }

      const result = await this.makeRequest(`?module=token&action=getToken&contractaddress=${contractAddress}`);
      
      if (result && result.status === "1") {
        return result;
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

      const result = await this.makeRequest(`?module=contract&action=getabi&address=${contractAddress}`);
      
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

  // Get popular tokens (known Chiliz ecosystem tokens)
  async getAllTokens(limit = 10) {
    try {
      const knownTokens = [
        {
          name: "Chiliz",
          symbol: "CHZ",
          contractAddress: "0x0000000000000000000000000000000000000000",
          decimals: "18",
          type: "Native Token"
        },
        {
          name: "Paris Saint-Germain Fan Token",
          symbol: "PSG", 
          contractAddress: "0x8Bb8e84A9b85F98f7d0cbAdFb26D3Aa84A503d3e",
          decimals: "0",
          type: "Fan Token"
        },
        {
          name: "FC Barcelona Fan Token",
          symbol: "BAR",
          contractAddress: "0x9F5377D4A915A3D62d13A15bB88D30bb8a2C4E40", 
          decimals: "0",
          type: "Fan Token"
        },
        {
          name: "Juventus Fan Token",
          symbol: "JUV",
          contractAddress: "0xF2f93d847266E2703a39Ef27391E1cD3FC19d50C",
          decimals: "2",
          type: "Fan Token"
        },
        {
          name: "AC Milan Fan Token", 
          symbol: "ACM",
          contractAddress: "0xbEAb3b9AF7B4C7C6C3a2B73F1d8C5a69Ff6b4b4b",
          decimals: "0",
          type: "Fan Token"
        },
        {
          name: "AS Roma Fan Token",
          symbol: "ASR", 
          contractAddress: "0xb8C77C860e8E9F6d29554fB0E86F54b5F749d4e3",
          decimals: "2",
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
      // Enhanced response for token searches
      const queryLower = query.toLowerCase().replace('$', '');
      
      return `## Token Search: "${query}"

I searched for this token on the Chiliz Chain but couldn't find specific information in the live API data.

**For ${query.toUpperCase()}:**
${queryLower === 'asr' ? '✅ **AS Roma Fan Token (ASR)** is a known fan token on Chiliz Chain' : ''}
${queryLower === 'psg' ? '✅ **Paris Saint-Germain Fan Token (PSG)** is available on Chiliz Chain' : ''}
${queryLower === 'bar' ? '✅ **FC Barcelona Fan Token (BAR)** is available on Chiliz Chain' : ''}
${queryLower === 'juv' ? '✅ **Juventus Fan Token (JUV)** is available on Chiliz Chain' : ''}
${queryLower === 'acm' ? '✅ **AC Milan Fan Token (ACM)** is available on Chiliz Chain' : ''}
${queryLower === 'chz' ? '✅ **Chiliz (CHZ)** is the native token of Chiliz Chain' : ''}

**This could mean:**
- API response limitations or temporary issues
- Token exists but isn't fully indexed in the API
- Token might be on a different network

**Next steps:**
1. **Manual verification**: Visit ${this.explorerURL}/tokens and search manually
2. **Provide contract address**: If you have it, I can get detailed information
3. **Check official sources**: Project website or social media for accurate details

**Popular Chiliz tokens:**
- $CHZ (Native token)
- $PSG (Paris Saint-Germain) 
- $BAR (FC Barcelona)
- $JUV (Juventus)
- $ACM (AC Milan)
- $ASR (AS Roma)`;
    }

    if (results.type === 'address') {
      let formatted = `## Address Information: \`${results.address}\`\n\n`;
      
      if (results.tokenInfo && results.tokenInfo.result) {
        formatted += this.formatTokenInfo(results.tokenInfo.result);
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
