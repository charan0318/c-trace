
const CHILIZ_SCAN_API_BASE = "https://api.chiliscan.com/api";
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
        }
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

  // Search for tokens by name or symbol
  async searchTokens(query) {
    try {
      const cleanQuery = query.trim().toLowerCase();
      
      // Try different variations of the query
      const queryVariations = [
        cleanQuery,
        cleanQuery.toUpperCase(),
        cleanQuery.replace('$', ''),
        `$${cleanQuery.replace('$', '')}`,
      ];

      // Try different endpoints for token search
      const endpoints = [
        `/v1/tokens?search=`,
        `/tokens?q=`,
        `/v1/search?q=`,
        `/v1/token/search?symbol=`,
        `/api/v1/tokens?filter=`
      ];

      for (const queryVar of queryVariations) {
        for (const endpoint of endpoints) {
          const fullEndpoint = `${endpoint}${encodeURIComponent(queryVar)}`;
          if (endpoint.includes('search?q=')) {
            const result = await this.makeRequest(`${endpoint}${encodeURIComponent(queryVar)}&type=token`);
            if (result && result.result && result.result.length > 0) {
              return result.result;
            }
          } else {
            const result = await this.makeRequest(fullEndpoint);
            if (result && result.result && result.result.length > 0) {
              return result.result;
            }
          }
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
      const endpoints = [
        `/v1/tokens/${contractAddress}`,
        `/token?contractaddress=${contractAddress}`,
        `/v1/token/tokeninfo?contractaddress=${contractAddress}`
      ];

      for (const endpoint of endpoints) {
        const result = await this.makeRequest(endpoint);
        if (result && result.result) {
          return result.result;
        }
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
      const endpoints = [
        `/v1/contracts/${contractAddress}`,
        `/contract?address=${contractAddress}`,
        `/v1/contract/getabi?address=${contractAddress}`
      ];

      for (const endpoint of endpoints) {
        const result = await this.makeRequest(endpoint);
        if (result) {
          return result;
        }
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
      // Clean the query
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

  // Get all tokens list (for browsing popular tokens)
  async getAllTokens(limit = 50) {
    try {
      const endpoints = [
        `/v1/tokens?limit=${limit}`,
        `/tokens?limit=${limit}`,
        `/v1/token/list?limit=${limit}`
      ];

      for (const endpoint of endpoints) {
        const result = await this.makeRequest(endpoint);
        if (result && result.result) {
          return result.result;
        }
      }

      return null;
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
    
    if (tokenInfo.totalSupply) {
      formatted += `**Total Supply:** ${tokenInfo.totalSupply}\n`;
    }
    
    if (tokenInfo.price) {
      formatted += `**Price:** $${tokenInfo.price}\n`;
    }
    
    if (tokenInfo.marketCap) {
      formatted += `**Market Cap:** $${tokenInfo.marketCap}\n`;
    }

    formatted += `\n**ChilizScan Link:** ${this.explorerURL}/token/${tokenInfo.contractAddress || 'unknown'}`;
    
    return formatted;
  }

  // Format search results
  formatSearchResults(results, query) {
    if (!results) {
      return `I couldn't find any information for "${query}" on ChilizScan. This could mean:

1. The token doesn't exist on Chiliz Chain
2. The name/symbol might be spelled differently
3. It might be a newer token not yet indexed

**Suggestions:**
- Try searching with the exact contract address if you have it
- Check the official ChilizScan token list: ${this.explorerURL}/tokens
- Verify the token name/symbol spelling`;
    }

    if (results.type === 'address') {
      let formatted = `## Address Information: \`${results.address}\`\n\n`;
      
      if (results.tokenInfo) {
        formatted += this.formatTokenInfo(results.tokenInfo);
      } else if (results.contractInfo) {
        formatted += "## Contract Information\n\n";
        formatted += `**Address:** \`${results.address}\`\n`;
        formatted += `**Type:** Smart Contract\n`;
        
        if (results.contractInfo.name) {
          formatted += `**Name:** ${results.contractInfo.name}\n`;
        }
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
        if (token.decimals) {
          formatted += `**Decimals:** ${token.decimals}\n`;
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
    if (token.contractAddress) {
      formatted += `**Contract:** \`${token.contractAddress}\`\n`;
    }
    formatted += `**ChilizScan:** ${chilizScanAPI.explorerURL}/token/${token.contractAddress || ''}\n\n`;
  });

  return formatted;
}
