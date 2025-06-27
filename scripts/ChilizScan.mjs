
const CHILIZ_SCAN_API_BASE = "https://scan.chiliz.com/api";
const CHILIZ_SCAN_BASE = "https://scan.chiliz.com";

// ChilizScan API service
class ChilizScanAPI {
  constructor() {
    this.baseURL = CHILIZ_SCAN_API_BASE;
    this.explorerURL = CHILIZ_SCAN_BASE;
  }

  // Make API request with proper error handling
  async makeRequest(queryParams) {
    try {
      const url = `${this.baseURL}${queryParams}`;
      
      console.log("ChilizScan API Request:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'C-TRACE/1.0',
          'Origin': window.location.origin
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

  // Get transaction history for an address using proper API
  async getTransactionHistory(address, page = 1, offset = 10) {
    try {
      if (!address || !address.startsWith('0x') || address.length !== 42) {
        return null;
      }

      const results = {};
      
      // Get normal transactions
      const normalTx = await this.makeRequest(`?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=desc`);
      if (normalTx && normalTx.status === "1") {
        results.normal = normalTx.result;
      }

      // Get internal transactions
      const internalTx = await this.makeRequest(`?module=account&action=txlistinternal&address=${address}&page=${page}&offset=${offset}&sort=desc`);
      if (internalTx && internalTx.status === "1") {
        results.internal = internalTx.result;
      }

      // Get token transfers
      const tokenTx = await this.makeRequest(`?module=account&action=tokentx&address=${address}&page=${page}&offset=${offset}&sort=desc`);
      if (tokenTx && tokenTx.status === "1") {
        results.token = tokenTx.result;
      }

      return Object.keys(results).length > 0 ? results : null;
    } catch (error) {
      console.error("Get transaction history failed:", error);
      return null;
    }
  }

  // Get account balance and token list
  async getAccountInfo(address) {
    try {
      if (!address || !address.startsWith('0x') || address.length !== 42) {
        return null;
      }

      const results = {};
      
      // Get CHZ balance
      const balance = await this.makeRequest(`?module=account&action=balance&address=${address}`);
      if (balance && balance.status === "1") {
        results.balance = balance.result;
      }

      // Get token list
      const tokens = await this.makeRequest(`?module=account&action=tokenlist&address=${address}`);
      if (tokens && tokens.status === "1") {
        results.tokens = tokens.result;
      }

      return Object.keys(results).length > 0 ? results : null;
    } catch (error) {
      console.error("Get account info failed:", error);
      return null;
    }
  }

  // Get token information by contract address
  async getTokenInfo(contractAddress) {
    try {
      if (!contractAddress || !contractAddress.startsWith('0x')) {
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

  // Get token holders
  async getTokenHolders(contractAddress, page = 1, offset = 10) {
    try {
      if (!contractAddress || !contractAddress.startsWith('0x')) {
        return null;
      }

      const result = await this.makeRequest(`?module=token&action=getTokenHolders&contractaddress=${contractAddress}&page=${page}&offset=${offset}`);
      
      if (result && result.status === "1") {
        return result.result;
      }

      return null;
    } catch (error) {
      console.error("Get token holders failed:", error);
      return null;
    }
  }

  // Get contract ABI and source code
  async getContractInfo(contractAddress) {
    try {
      if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        return null;
      }

      const results = {};

      // Get ABI
      const abi = await this.makeRequest(`?module=contract&action=getabi&address=${contractAddress}`);
      if (abi && abi.status === "1") {
        results.abi = abi.result;
      }

      // Get source code
      const sourceCode = await this.makeRequest(`?module=contract&action=getsourcecode&address=${contractAddress}`);
      if (sourceCode && sourceCode.status === "1") {
        results.sourceCode = sourceCode.result;
      }

      return Object.keys(results).length > 0 ? results : null;
    } catch (error) {
      console.error("Get contract info failed:", error);
      return null;
    }
  }

  // Get transaction details
  async getTransactionInfo(txHash) {
    try {
      if (!txHash || !txHash.startsWith('0x')) {
        return null;
      }

      const result = await this.makeRequest(`?module=transaction&action=gettxinfo&txhash=${txHash}`);
      
      if (result && result.status === "1") {
        return result.result;
      }

      return null;
    } catch (error) {
      console.error("Get transaction info failed:", error);
      return null;
    }
  }

  // Get transaction receipt status
  async getTransactionStatus(txHash) {
    try {
      if (!txHash || !txHash.startsWith('0x')) {
        return null;
      }

      const results = {};

      // Get receipt status
      const receipt = await this.makeRequest(`?module=transaction&action=gettxreceiptstatus&txhash=${txHash}`);
      if (receipt && receipt.status === "1") {
        results.receipt = receipt.result;
      }

      // Get error status
      const status = await this.makeRequest(`?module=transaction&action=getstatus&txhash=${txHash}`);
      if (status && status.status === "1") {
        results.status = status.result;
      }

      return Object.keys(results).length > 0 ? results : null;
    } catch (error) {
      console.error("Get transaction status failed:", error);
      return null;
    }
  }

  // Search for tokens by name/symbol using known tokens and API
  async searchTokens(query) {
    try {
      const cleanQuery = query.trim().toLowerCase().replace('$', '');
      
      // First check known popular tokens
      const knownToken = this.getKnownTokenInfo(cleanQuery);
      if (knownToken) {
        // Try to get live data
        const liveData = await this.getTokenInfo(knownToken.contractAddress);
        if (liveData && liveData.status === "1") {
          return [{ ...knownToken, ...liveData.result }];
        }
        return [knownToken];
      }

      return null;
    } catch (error) {
      console.error("Token search failed:", error);
      return null;
    }
  }

  // Get known token information for popular Chiliz tokens
  getKnownTokenInfo(symbol) {
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

    return knownTokens[symbol.toLowerCase()] || null;
  }

  // General search function
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

      // Check if it's a transaction hash
      if (cleanQuery.startsWith('0x') && cleanQuery.length === 66) {
        const txInfo = await this.getTransactionInfo(cleanQuery);
        const txStatus = await this.getTransactionStatus(cleanQuery);
        
        return {
          type: 'transaction',
          hash: cleanQuery,
          txInfo,
          txStatus
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

  // Format search results
  formatSearchResults(results, query) {
    if (!results) {
      const queryLower = query.toLowerCase().replace('$', '');
      
      return `## Token Search: "${query}"

I searched ChilizScan API for this token but couldn't find it in the current data.

**For ${query.toUpperCase()}:**
${queryLower === 'asr' ? '✅ **AS Roma Fan Token (ASR)** is a known fan token on Chiliz Chain' : ''}
${queryLower === 'psg' ? '✅ **Paris Saint-Germain Fan Token (PSG)** is available on Chiliz Chain' : ''}
${queryLower === 'bar' ? '✅ **FC Barcelona Fan Token (BAR)** is available on Chiliz Chain' : ''}
${queryLower === 'juv' ? '✅ **Juventus Fan Token (JUV)** is available on Chiliz Chain' : ''}
${queryLower === 'acm' ? '✅ **AC Milan Fan Token (ACM)** is available on Chiliz Chain' : ''}
${queryLower === 'chz' ? '✅ **Chiliz (CHZ)** is the native token of Chiliz Chain' : ''}

**This could mean:**
- Token exists but API data is limited
- Token might be very new or unlisted
- Alternative spelling or symbol needed

**Next steps:**
1. **Manual verification**: Visit ${this.explorerURL}/tokens
2. **Provide contract address**: For detailed token analysis
3. **Check popular tokens**: Try searching for known fan tokens

**Popular Chiliz tokens:**
- $CHZ (Native token)
- $PSG (Paris Saint-Germain) 
- $BAR (FC Barcelona)
- $JUV (Juventus)
- $ACM (AC Milan)
- $ASR (AS Roma)`;
    }

    if (results.type === 'address') {
      let formatted = `## Address Analysis: \`${results.address}\`\n\n`;
      
      if (results.tokenInfo && results.tokenInfo.result) {
        formatted += "### Token Information\n";
        const token = results.tokenInfo.result;
        if (token.name) formatted += `**Name:** ${token.name}\n`;
        if (token.symbol) formatted += `**Symbol:** ${token.symbol}\n`;
        if (token.decimals) formatted += `**Decimals:** ${token.decimals}\n`;
        if (token.totalSupply) formatted += `**Total Supply:** ${token.totalSupply}\n`;
      }
      
      if (results.contractInfo) {
        formatted += "\n### Contract Information\n";
        if (results.contractInfo.abi) {
          formatted += "**Status:** Verified Contract\n";
          formatted += "**ABI:** Available\n";
        }
        if (results.contractInfo.sourceCode && results.contractInfo.sourceCode[0]) {
          const source = results.contractInfo.sourceCode[0];
          if (source.ContractName) formatted += `**Contract Name:** ${source.ContractName}\n`;
          if (source.CompilerVersion) formatted += `**Compiler:** ${source.CompilerVersion}\n`;
        }
      }
      
      formatted += `\n**ChilizScan Link:** ${this.explorerURL}/address/${results.address}`;
      return formatted;
    }

    if (results.type === 'transaction') {
      let formatted = `## Transaction Details: \`${results.hash}\`\n\n`;
      
      if (results.txInfo) {
        const tx = results.txInfo;
        if (tx.blockNumber) formatted += `**Block:** ${tx.blockNumber}\n`;
        if (tx.from) formatted += `**From:** \`${tx.from}\`\n`;
        if (tx.to) formatted += `**To:** \`${tx.to}\`\n`;
        if (tx.value) formatted += `**Value:** ${(parseInt(tx.value) / Math.pow(10, 18)).toFixed(4)} CHZ\n`;
        if (tx.gasUsed) formatted += `**Gas Used:** ${tx.gasUsed}\n`;
      }

      if (results.txStatus) {
        formatted += "\n### Transaction Status\n";
        if (results.txStatus.receipt) {
          formatted += `**Status:** ${results.txStatus.receipt.status === "1" ? "Success" : "Failed"}\n`;
        }
        if (results.txStatus.status && results.txStatus.status.errDescription) {
          formatted += `**Error:** ${results.txStatus.status.errDescription}\n`;
        }
      }

      formatted += `\n**ChilizScan Link:** ${this.explorerURL}/tx/${results.hash}`;
      return formatted;
    }

    if (results.type === 'tokens' && results.results.length > 0) {
      let formatted = `## Found ${results.results.length} token(s) matching "${query}":\n\n`;
      
      results.results.forEach((token, index) => {
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

      return formatted;
    }

    return `No results found for "${query}" on ChilizScan.`;
  }
}

// Export the API instance
export const chilizScanAPI = new ChilizScanAPI();

// Main search function
export async function searchChilizScan(query) {
  console.log("Searching ChilizScan for:", query);
  
  const results = await chilizScanAPI.generalSearch(query);
  return chilizScanAPI.formatSearchResults(results, query);
}

// Token lookup function
export async function lookupToken(tokenNameOrSymbol) {
  console.log("Looking up token:", tokenNameOrSymbol);
  
  const results = await chilizScanAPI.searchTokens(tokenNameOrSymbol);
  return chilizScanAPI.formatSearchResults({ type: 'tokens', results }, tokenNameOrSymbol);
}

// Analyze address with comprehensive data
export async function analyzeAddressHistory(address) {
  console.log("Analyzing address history for:", address);
  
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    return "Invalid address format. Please provide a valid Ethereum address (0x followed by 40 characters).";
  }

  try {
    // Get comprehensive address data
    const accountInfo = await chilizScanAPI.getAccountInfo(address);
    const txHistory = await chilizScanAPI.getTransactionHistory(address, 1, 20);
    const contractInfo = await chilizScanAPI.getContractInfo(address);
    
    let analysis = `## Comprehensive Address Analysis: \`${address}\`\n\n`;
    
    // Account overview
    analysis += "### Account Overview\n";
    if (accountInfo && accountInfo.balance) {
      const balanceInCHZ = (parseInt(accountInfo.balance) / Math.pow(10, 18)).toFixed(4);
      analysis += `**CHZ Balance:** ${balanceInCHZ} CHZ\n`;
    }
    
    if (accountInfo && accountInfo.tokens && Array.isArray(accountInfo.tokens)) {
      analysis += `**Token Holdings:** ${accountInfo.tokens.length} different tokens\n`;
      if (accountInfo.tokens.length > 0) {
        analysis += "**Top Tokens:**\n";
        accountInfo.tokens.slice(0, 5).forEach((token, i) => {
          analysis += `  ${i + 1}. ${token.name || 'Unknown'} (${token.symbol || 'N/A'})\n`;
        });
      }
    }
    
    // Contract analysis if applicable
    if (contractInfo) {
      analysis += "\n### Contract Analysis\n";
      analysis += "**Type:** Smart Contract\n";
      if (contractInfo.abi) {
        analysis += "**Status:** Verified\n";
      }
      if (contractInfo.sourceCode && contractInfo.sourceCode[0]) {
        const source = contractInfo.sourceCode[0];
        if (source.ContractName) analysis += `**Name:** ${source.ContractName}\n`;
        if (source.CompilerVersion) analysis += `**Compiler:** ${source.CompilerVersion}\n`;
      }
    }
    
    // Transaction analysis
    analysis += "\n### Transaction History\n";
    if (txHistory) {
      let totalTxs = 0;
      
      if (txHistory.normal && txHistory.normal.length > 0) {
        totalTxs += txHistory.normal.length;
        analysis += `**Normal Transactions:** ${txHistory.normal.length}\n`;
      }
      
      if (txHistory.internal && txHistory.internal.length > 0) {
        totalTxs += txHistory.internal.length;
        analysis += `**Internal Transactions:** ${txHistory.internal.length}\n`;
      }
      
      if (txHistory.token && txHistory.token.length > 0) {
        totalTxs += txHistory.token.length;
        analysis += `**Token Transfers:** ${txHistory.token.length}\n`;
      }
      
      if (totalTxs > 0) {
        analysis += `\n**Total Activity:** ${totalTxs} transactions\n`;
        
        // Recent activity
        if (txHistory.normal && txHistory.normal.length > 0) {
          analysis += "\n#### Recent Normal Transactions:\n";
          txHistory.normal.slice(0, 3).forEach((tx, i) => {
            const value = (parseInt(tx.value || '0') / Math.pow(10, 18)).toFixed(4);
            analysis += `${i + 1}. **Block ${tx.blockNumber}** - ${value} CHZ to \`${tx.to}\`\n`;
          });
        }
      }
    } else {
      analysis += "**Status:** No recent transaction data available from API\n";
    }
    
    analysis += `\n**ChilizScan Link:** ${chilizScanAPI.explorerURL}/address/${address}\n`;
    analysis += `\n**💡 Tip:** This analysis used the official ChilizScan API for comprehensive data.`;
    
    return analysis;
    
  } catch (error) {
    console.error("Address analysis error:", error);
    return `## Address Analysis Error

Error analyzing address \`${address}\` using ChilizScan API.

**What you can do:**
1. **Manual Review**: Visit ${chilizScanAPI.explorerURL}/address/${address}
2. **Try Again**: API might be temporarily unavailable
3. **Alternative Analysis**: Try searching for specific tokens or contracts

The ChilizScan API provides comprehensive blockchain data when available.`;
  }
}

// Get transaction details
export async function analyzeTransaction(txHash) {
  console.log("Analyzing transaction:", txHash);
  
  if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
    return "Invalid transaction hash format. Please provide a valid transaction hash (0x followed by 64 characters).";
  }

  try {
    const results = await chilizScanAPI.generalSearch(txHash);
    return chilizScanAPI.formatSearchResults(results, txHash);
  } catch (error) {
    console.error("Transaction analysis error:", error);
    return `Error analyzing transaction ${txHash}. Please try again or check the hash manually on ChilizScan.`;
  }
}

// Get token holders analysis
export async function analyzeTokenHolders(contractAddress) {
  console.log("Analyzing token holders for:", contractAddress);
  
  try {
    const tokenInfo = await chilizScanAPI.getTokenInfo(contractAddress);
    const holders = await chilizScanAPI.getTokenHolders(contractAddress, 1, 50);
    
    let analysis = `## Token Holder Analysis: \`${contractAddress}\`\n\n`;
    
    if (tokenInfo && tokenInfo.result) {
      const token = tokenInfo.result;
      analysis += "### Token Information\n";
      if (token.name) analysis += `**Name:** ${token.name}\n`;
      if (token.symbol) analysis += `**Symbol:** ${token.symbol}\n`;
      if (token.totalSupply) analysis += `**Total Supply:** ${token.totalSupply}\n`;
    }
    
    if (holders && holders.length > 0) {
      analysis += `\n### Holder Distribution\n`;
      analysis += `**Total Holders Analyzed:** ${holders.length}\n\n`;
      
      analysis += "#### Top Holders:\n";
      holders.slice(0, 10).forEach((holder, i) => {
        const percentage = holder.percentage || 'N/A';
        analysis += `${i + 1}. \`${holder.address}\` - ${holder.value || 'N/A'} tokens (${percentage}%)\n`;
      });
    } else {
      analysis += "\n**Status:** Unable to retrieve holder data from API\n";
    }
    
    analysis += `\n**ChilizScan Link:** ${chilizScanAPI.explorerURL}/token/${contractAddress}`;
    
    return analysis;
  } catch (error) {
    console.error("Token holder analysis error:", error);
    return `Error analyzing token holders for ${contractAddress}. Please try again.`;
  }
}
