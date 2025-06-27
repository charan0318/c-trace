"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Send, Terminal, ArrowDown, Copy, Edit, Zap, FileText, TrendingUp, Activity } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Silk from '@/app/components/ui/Silk';

// Import script to interact with Nebula API
import {
  createSession,
  queryContract,
  handleUserMessage,
  executeCommand,
  searchChilizScan,
  lookupToken,
  getPopularTokens,
} from "../../../scripts/Nebula.mjs";

import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

import {
  sendAndConfirmTransaction,
  prepareTransaction,
  defineChain,
} from "thirdweb";
import { client } from "../client";

// Utility function
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Auto-scroll hook
interface ScrollState {
  isAtBottom: boolean;
  autoScrollEnabled: boolean;
}

function useAutoScroll(contentLength?: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastContentHeight = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    autoScrollEnabled: true,
  });

  const checkIsAtBottom = useCallback((element: HTMLElement) => {
    if (!element || !element.parentNode) return false;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const distanceToBottom = Math.abs(scrollHeight - scrollTop - clientHeight);
    return distanceToBottom <= 20;
  }, []);

  const scrollToBottom = useCallback((instant?: boolean) => {
    const element = scrollRef.current;
    if (!element || !document.contains(element)) return;

    try {
      const targetScrollTop = element.scrollHeight - element.clientHeight;

      if (instant) {
        element.scrollTop = targetScrollTop;
      } else {
        element.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }

      setScrollState({
        isAtBottom: true,
        autoScrollEnabled: true,
      });
    } catch (error) {
      console.warn("Scroll operation failed:", error);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element || !element.parentNode) return;

    const atBottom = checkIsAtBottom(element);
    setScrollState((prev) => ({
      isAtBottom: atBottom,
      autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled,
    }));
  }, [checkIsAtBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollHandler = handleScroll;
    element.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      // Clean up safely
      try {
        if (element && scrollHandler) {
          element.removeEventListener("scroll", scrollHandler);
        }
      } catch (error) {
        // Ignore removal errors during cleanup
        console.warn("Scroll event cleanup warning:", error);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Check if element is still connected to DOM
    if (!document.contains(scrollElement)) return;

    const currentHeight = scrollElement.scrollHeight;
    const hasNewContent = currentHeight !== lastContentHeight.current;

    if (hasNewContent && scrollState.autoScrollEnabled) {
      // Cancel any pending animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Use timeout with additional DOM safety check
      timeoutRef.current = setTimeout(() => {
        const currentScrollElement = scrollRef.current;
        if (currentScrollElement && document.contains(currentScrollElement)) {
          scrollToBottom(lastContentHeight.current === 0);
        }
      }, 50);

      lastContentHeight.current = currentHeight;
    }
  }, [contentLength, scrollState.autoScrollEnabled, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    scrollRef,
    isAtBottom: scrollState.isAtBottom,
    scrollToBottom: () => scrollToBottom(false),
  };
}

// Chat Bubble Components
interface ChatBubbleProps {
  variant?: "sent" | "received";
  children: React.ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ variant = "received", children }) => {
  return (
    <div className={cn(
      "flex gap-2 md:gap-4 max-w-full sm:max-w-[90%] md:max-w-[85%] group",
      variant === "sent" ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {children}
    </div>
  );
};

interface ChatBubbleAvatarProps {
  fallback: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({ fallback }) => {
  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-chiliz-primary to-red-600 text-xs font-medium text-white">
      {fallback}
    </div>
  );
};

interface ChatBubbleMessageProps {
  variant?: "sent" | "received";
  isLoading?: boolean;
  children?: React.ReactNode;
}

const ChatBubbleMessage: React.FC<ChatBubbleMessageProps> = ({ 
  variant = "received", 
  isLoading = false, 
  children 
}) => {
  return (
    <div className={cn(
      "relative rounded-2xl text-sm transition-all duration-300 animate-fade-in",
      variant === "sent"
        ? "bg-gradient-to-br from-chiliz-primary/20 to-red-600/20 text-white ml-auto px-4 py-3"
        : "bg-transparent text-white p-0"
    )}>


      {isLoading ? (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-white/70 text-xs">C-TRACE is thinking...</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          {children}
        </div>
      )}
    </div>
  );
};

// Action Button Component
interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative p-4 md:p-6 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-white/20 hover:border-chiliz-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 hover:bg-gray-900/60 text-left w-full min-h-[88px] touch-manipulation"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-chiliz-primary/20 to-red-600/20 border border-chiliz-primary/30 group-hover:from-chiliz-primary/30 group-hover:to-red-600/30 transition-all duration-300 flex-shrink-0">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-chiliz-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base text-white mb-1 group-hover:text-chiliz-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-white/60 group-hover:text-white/80 transition-colors leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export function BlockchainExplorer() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");
  const contractAddress = searchParams.get("searchTerm");
  const textQuery = searchParams.get("query");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestedActions, setShowSuggestedActions] = useState(false);
  const [executeMode, setExecuteMode] = useState(false);
  const [executeResponse, setExecuteResponse] = useState(null);

  const account = useActiveAccount();
  const walletAddress = account?.address;

  // Check if we have contract details to explore or a text query
  const hasContractToExplore = contractAddress && chainId;
  const hasTextQuery = textQuery && chainId;

  const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll(messages.length);

  const chilizChain = defineChain(88888);

  const suggestedActions = [
    "What is Chiliz and how does it work?",
    "Show me popular fan tokens",
    "$CHZ token information",
    "$BAR (FC Barcelona) fan token details",
    "How to interact with fan tokens?",
    "Popular tokens on Chiliz Chain",
  ];

  const actionButtons = [
    {
      icon: Search,
      title: "Analyze Chiliz Contract",
      description: "Explore any Chiliz smart contract. Uncover methods, data, and fan token logic instantly",
      prompt: "Analyze this smart contract on Chiliz Chain: [paste address]"
    },
    {
      icon: TrendingUp,
      title: "Fan Token Discovery",
      description: "Browse popular fan tokens and discover new ones using ChilizScan integration",
      prompt: "Show me popular fan tokens on Chiliz Chain"
    },
    {
      icon: FileText,
      title: "Token Lookup",
      description: "Search for any token by name, symbol, or contract address using ChilizScan data",
      prompt: "Search for a specific token (e.g., chilizinu, kayen, or $CHZ)"
    },
    {
      icon: Zap,
      title: "Contract Interaction",
      description: "Execute read-only functions on Chiliz contracts and fan tokens",
      prompt: "Help me interact with a fan token contract on Chiliz Chain."
    },
  ];

  useEffect(() => {
    const initSession = async () => {
      try {
        console.log("🔄 Initializing session...");
        console.log("📋 URL Parameters:", { contractAddress, chainId, hasContractToExplore, textQuery });

        const newSessionId = await createSession("Blockchain Explorer Session");
        console.log("✅ Session created:", newSessionId);
        setSessionId(newSessionId);

        if (hasContractToExplore) {
          console.log("🔍 Contract to explore:", contractAddress, "on chain:", chainId);
          setIsTyping(true);
          const contractDetails = await queryContract(
            contractAddress!,
            chainId!,
            newSessionId
          );
          console.log("📄 Contract details received");
          setMessages([
            { role: "system", content: "Welcome to the C-TRACE Blockchain Explorer." },
            {
              role: "system",
              content: contractDetails || "No details available for this contract.",
            },
          ]);
          setIsTyping(false);
        } else if (hasTextQuery) {
          console.log("🔍 Text query to process:", textQuery, "on chain:", chainId);

          // Get search parameters to understand the type of search
          const searchType = searchParams.get("searchType");
          const symbol = searchParams.get("symbol");

          setIsTyping(true);

          // Enhance the query based on search type
          let enhancedQuery = textQuery!;
          if (searchType === "token") {
            enhancedQuery = `I need you to search for the token "${symbol || textQuery}" on Chiliz Chain. Please provide: 1) The exact contract address 2) Token symbol 3) Total supply 4) Number of decimals 5) Current holder count 6) If it exists on Chiliz scan.chiliz.com. If you cannot find it on Chiliz, please indicate that clearly and suggest checking other networks or verify the token name spelling.`;
          } else if (textQuery!.toLowerCase().includes('contract address') || textQuery!.toLowerCase().includes('chilizinu') || textQuery!.toLowerCase().includes('kayen')) {
            enhancedQuery = `Search for specific token information: "${textQuery}". I need the exact contract address and token details. Please check the Chiliz blockchain explorer and provide comprehensive information about this token including its contract address, symbol, supply, and verification status.`;
          }

          const queryResponse = await handleUserMessage(
            enhancedQuery,
            newSessionId,
            chainId!,
            ""
          );
          console.log("📄 Query response received");
          setMessages([
            { role: "system", content: "Welcome to the C-TRACE Blockchain Explorer." },
            { role: "user", content: textQuery! },
            {
              role: "system",
              content: queryResponse || "No information available for this query.",
            },
          ]);
          setIsTyping(false);
        } else {
          console.log("💬 Loading default welcome message");
          setMessages([
            {
              role: "system",
              content: "Welcome to C-TRACE 🚀 I'm your AI assistant for exploring the Chiliz blockchain and ecosystem. I can help you find contract addresses, analyze tokens, and explore the Chiliz ecosystem. What would you like to discover?",
            },
          ]);
        }
      } catch (error) {
        console.error("❌ Error in session initialization:", error);
        setMessages([
          {
            role: "system",
            content: "Welcome to C-TRACE 🚀 I'm ready to help you explore Chiliz blockchain and fan token data. What would you like to discover?",
          },
        ]);
        setIsTyping(false);
      }
    };

    initSession();
  }, [contractAddress, chainId, hasContractToExplore, textQuery, hasTextQuery, searchParams]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    try {
      setIsTyping(true);

      if (hasContractToExplore) {
        const response = await handleUserMessage(
          userMessage,
          sessionId,
          chainId!,
          contractAddress!
        );
        setMessages((prev) => [...prev, { role: "system", content: response }]);
      } else {
        const response = await handleUserMessage(
          userMessage,
          sessionId,
          chainId || "88888",
          ""
        );
        setMessages((prev) => [...prev, { role: "system", content: response }]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error handling user message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Failed to process your query. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt: string, autoSubmit: boolean = false) => {
    setInput(prompt);
    if (autoSubmit) {
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const handleExecute = async () => {
    if (!account?.address || !input.includes("execute")) return;

    const executeMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: executeMessage }]);
    setInput("");

    try {
      setIsTyping(true);

      // Show initial message that we're preparing the transaction
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "🔄 Preparing transaction... Please wait for wallet prompt.",
        },
      ]);

      const executeResponse = await executeCommand(
        executeMessage,
        account.address,
        "default-user",
        false,
        chainId || "88888",
        contractAddress || "",
        sessionId
      );

      console.log("Execute response:", executeResponse);

      const action = executeResponse.actions?.find(
        (a: { type: string; data: string }) => a.type === "sign_transaction"
      );

      if (action) {
        const transactionData = JSON.parse(action.data);
        console.log("Transaction data:", transactionData);

        // Prepare the transaction
        const preparedTransaction = prepareTransaction({
          to: transactionData.to,
          value: BigInt(transactionData.value || 0),
          data: transactionData.data,
          chain: chilizChain,
          client,
        });

        console.log("Prepared transaction:", preparedTransaction);

        // Update message to show wallet approval needed
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the preparing message
          {
            role: "system",
            content: "💰 **Transaction Ready!** Please approve the transaction in your wallet to continue.",
          },
        ]);

        // Send transaction with proper wallet approval
        try {
          const receipt = await sendAndConfirmTransaction({
            transaction: preparedTransaction,
            account,
          });

          console.log("Transaction receipt:", receipt);

        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the approval message
          {
            role: "system",
            content: `## ✅ Transaction Successful!

**Transaction Hash:** \`${receipt.transactionHash}\`
**Status:** Confirmed
**Network:** Chiliz Chain

🔗 **View on ChilizScan:** [${receipt.transactionHash}](https://scan.chiliz.com/tx/${receipt.transactionHash})

Your transaction has been successfully executed and confirmed on the blockchain.`,
          },
        ]);
        } catch (txError) {
          console.error("Transaction execution failed:", txError);
          setMessages((prev) => [
            ...prev.slice(0, -1), // Remove the approval message
            {
              role: "system",
              content: `## ❌ Transaction Failed

**Error:** ${txError.message || 'Transaction execution failed'}

**Common Issues:**
- User rejected the transaction in wallet
- Insufficient balance for transaction + gas fees
- Invalid recipient address
- Network connectivity issues
- Gas estimation failed

**Solutions:**
1. Check your wallet balance (ask "what is my balance")
2. Ensure you're connected to Chiliz Chain (ID: 88888)
3. Try reducing the transaction amount
4. Check recipient address is valid
5. Ensure you have enough CHZ for gas fees`,
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the preparing message
          {
            role: "system",
            content: `## ❌ Transaction Preparation Failed

No valid transaction data received from the command.

**Debug Info:**
- Response: ${JSON.stringify(executeResponse, null, 2)}

**Possible Issues:**
- Invalid command format
- Unsupported transaction type
- Missing required parameters

Please check your command format and try again. Example: "execute transfer 0.1 CHZ to 0x..."`,
          },
        ]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error in transaction flow:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove any pending messages
        {
          role: "system",
          content: `## ❌ Transaction Error

**Error:** ${error.message || 'Unknown error occurred'}

**Error Type:** ${error.name || 'Unknown'}

**Common Issues:**
- Wallet connection lost
- Network connectivity problems
- Invalid transaction parameters
- Insufficient permissions

**Solutions:**
1. Reconnect your wallet
2. Refresh the page and try again
3. Check your internet connection
4. Ensure you're on Chiliz Chain (ID: 88888)`,
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !sessionId) return;

    // Check for balance queries first
    const balanceQueries = [
      'what is my balance',
      'show my balance', 
      'check my balance',
      'get my balance',
      'my balance',
      'wallet balance'
    ];

    const isBalanceQuery = balanceQueries.some(query => 
      userMessage.toLowerCase().includes(query)
    );

    if (isBalanceQuery) {
      setIsTyping(true);
      const newMessage = { role: "user", content: userMessage };
      setMessages((prev) => [...prev, newMessage]);

      if (!walletAddress) {
        const connectWalletMessage = {
          role: "system",
          content: `## 🔗 Connect Your Wallet

To check your balance, please connect your wallet first using the "Connect Wallet" button in the top-right corner.

**Supported Wallets:**
- MetaMask
- Coinbase Wallet
- Rainbow
- Rabby Wallet
- Socios Wallet
- In-App Wallet (Email, Google, Apple, Facebook, Phone)

Once connected, I'll be able to show you your CHZ balance on Chiliz Chain.`,
        };
        setMessages((prev) => [...prev, connectWalletMessage]);
        setIsTyping(false);
        return;
      }

      try {
        // Try multiple methods to get balance
        let balance = null;
        let method = "unknown";

        // Method 1: Direct Chiliz RPC call (most reliable for Chiliz)
        try {
          const response = await fetch('https://spicy-rpc.chiliz.com/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [walletAddress, 'latest'],
              id: Date.now()
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.result && !data.error) {
              balance = data.result;
              method = "Direct Chiliz RPC";
              console.log("Balance fetched via direct RPC:", balance);
            } else if (data.error) {
              console.log("RPC returned error:", data.error);
            }
          } else {
            console.log("RPC request failed with status:", response.status);
          }
        } catch (error) {
          console.log("Direct RPC failed, trying Thirdweb...", error);
        }

        // Method 2: Direct Chiliz RPC call as fallback
        if (!balance) {
          try {
            const response = await fetch('https://spicy-rpc.chiliz.com/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [walletAddress, 'latest'],
                id: 1
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.result) {
                balance = data.result;
                method = "Direct Chiliz RPC";
                console.log("Balance fetched via direct RPC:", balance);
              }
            }
          } catch (error) {
            console.log("Direct RPC also failed:", error);
          }
        }

        if (balance) {
          // Convert hex balance to decimal and then to CHZ
          const balanceInWei = BigInt(balance);
          const balanceInCHZ = Number(balanceInWei) / Math.pow(10, 18);
          
          // Format balance with appropriate decimal places
          let formattedBalance;
          if (balanceInCHZ === 0) {
            formattedBalance = "0.0000";
          } else if (balanceInCHZ < 0.0001) {
            formattedBalance = balanceInCHZ.toExponential(4);
          } else {
            formattedBalance = balanceInCHZ.toFixed(4);
          }

          const balanceResponse = `## 💰 Your Wallet Balance

**Address:** \`${walletAddress}\`
**Balance:** ${formattedBalance} CHZ
**Network:** Chiliz Chain (ID: 88888)
**Method:** ${method}
**Raw Balance:** ${balance} (wei)

💡 **Tip:** Your balance is automatically updated when you make transactions on the Chiliz network.

**Quick Actions:**
- Type "execute transfer 0.1 CHZ to [address]" to send CHZ
- Ask about fan tokens to explore PSG, BAR, JUV, and more

**Troubleshooting:**
If balance shows 0 but you expect more:
• Verify you're on the correct Chiliz Chain network
• Check your address on [ChilizScan](https://scan.chiliz.com/address/${walletAddress})
• Ensure your wallet is properly connected`;

          const aiMessage = {
            role: "system",
            content: balanceResponse,
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error("Failed to fetch balance from all methods");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        const errorMessage = {
          role: "system",
          content: `## ❌ Balance Fetch Failed

Unable to fetch your balance. This might be due to:

**Possible Issues:**
- Network connectivity problems
- RPC endpoint temporarily unavailable
- Wallet not properly connected to Chiliz Chain

**Try these solutions:**
1. **Reconnect wallet** - Disconnect and reconnect your wallet
2. **Switch networks** - Make sure you're on Chiliz Chain (ID: 88888)
3. **Check connection** - Ensure stable internet connection
4. **Try again** - Sometimes RPC calls need a retry

**Manual Check:**
Visit [ChilizScan](https://scan.chiliz.com/address/${walletAddress}) to view your balance directly.`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    setIsTyping(true);
    const newMessage = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newMessage]);

    try {
      let response;
      if (executeMode && walletAddress) {
        response = await executeCommand(
          userMessage,
          walletAddress,
          "default-user",
          false,
          chainId || "88888",
          contractAddress || "",
          sessionId
        );
        setExecuteResponse(response);
      } else {
        response = await handleUserMessage(
          userMessage,
          sessionId,
          chainId || "88888",
          contractAddress || ""
        );
      }

      const aiMessage = {
        role: "system",
        content: response?.message || response || "No response received.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error handling message:", error);
      const errorMessage = {
        role: "system",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-10">
      {/* Silk Background */}
      <div className="absolute inset-0" style={{ zIndex: -10 }}>
        <Silk
          speed={2}
          scale={1.8}
          color="#4a4a7e"
          noiseIntensity={1.2}
          rotation={0}
        />
      </div>

      {/* Subtle overlay to enhance visibility */}
      <div className="absolute inset-0 bg-black/30" style={{ zIndex: -5 }} />

      {/* Essential Tips Box - Fixed Position Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 w-72 max-h-[70vh] overflow-y-auto">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-white">Essential Tips</h3>
          </div>
          
          {/* Tips List */}
          <div className="space-y-3">
            <div className="group">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-chiliz-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-white/90 font-medium">Execute Commands</p>
                  <p className="text-xs text-white/60 leading-relaxed">Use "execute" prefix to transfer tokens or interact with contracts</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-white/90 font-medium">Token Details</p>
                  <p className="text-xs text-white/60 leading-relaxed"> Use " What is xxx token" for addresses & details (e.g., "What is CHZ token")</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-white/90 font-medium">Wallet Connection</p>
                  <p className="text-xs text-white/60 leading-relaxed">Connect wallet first to check balances and execute transactions</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-white/90 font-medium">Contract Analysis</p>
                  <p className="text-xs text-white/60 leading-relaxed">Paste contract addresses directly for instant analysis</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-white/90 font-medium">Natural Language</p>
                  <p className="text-xs text-white/60 leading-relaxed">Ask questions in plain English - C-TRACE understands context</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-chiliz-primary font-medium text-center">💡 Pro Tip: Be specific for better results!</p>
          </div>
        </div>
      </div>

      {/* Connect Wallet Button - Fixed Position Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl">
          <ConnectButton
                        client={client}
                        wallets={[
                          createWallet("io.metamask"),
                          createWallet("com.coinbase.wallet"),
                          createWallet("me.rainbow"),
                          createWallet("io.rabby"),
                          createWallet("com.socios.fan"),
                          createWallet("io.trust"),
                          inAppWallet({
                            auth: {
                              options: ["email", "google", "apple", "facebook", "phone"],
                            },
                          }),
                        ]}
                        connectModal={{ 
                          size: "compact",
                          title: "Connect to C-TRACE",
                          titleIcon: "",
                        }}
                        connectButton={{
                          label: "Connect Wallet",
                          style: {
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            padding: '12px 20px',
                            minWidth: '140px',
                            borderRadius: '12px',
                            display: 'block',
                            width: 'auto',
                            textAlign: 'center',
                          }
                        }}
                        detailsButton={{
                          style: {
                            background: 'linear-gradient(135deg, rgba(255, 178, 102, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                            border: '1px solid rgba(255, 178, 102, 0.3)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            padding: '12px 20px',
                            minWidth: '140px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: 'auto',
                            textAlign: 'center',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 4px 12px rgba(255, 178, 102, 0.15)',
                            transition: 'all 0.3s ease',
                          }
                        }}
                        detailsModal={{
                          style: {
                            background: 'rgba(17, 24, 39, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 178, 102, 0.2)',
                            borderRadius: '16px',
                            color: 'white',
                          }
                        }}
                      />
        </div>
      </div>

      {/* Got Feedback Button - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://t.me/ch04niverse"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900/80 border border-white/30 hover:border-chiliz-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 rounded-full backdrop-blur-md"
        >
          {/* Gradient background on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

          {/* Button content */}
          <span className="relative z-10 whitespace-nowrap group-hover:text-chiliz-primary transition-colors">Got Feedback?</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col">

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex flex-col w-full h-full px-4 md:px-6 py-2 md:py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 transition-colors"
            ref={scrollRef}
          >
            <div className="flex flex-col min-h-full pb-6 space-y-3 md:space-y-4 max-w-full md:max-w-3xl lg:max-w-4xl mx-auto w-full">
              {messages.map((message, index) => (
                <div key={index} className={message.role === "system" ? "mt-1 md:mt-2" : ""}>
                  <ChatBubble variant={message.role === "user" ? "sent" : "received"}>
                    <ChatBubbleAvatar fallback={message.role === "user" ? "U" : "C"} />
                    <ChatBubbleMessage variant={message.role === "user" ? "sent" : "received"}>
                      {message.role === "system" && message.content.includes("Contract Details") ? (
                        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-3 md:p-6 rounded-2xl border border-white/10 backdrop-blur-sm overflow-x-auto">
                          <ReactMarkdown 
                            className="prose prose-invert max-w-none text-sm md:text-base"
                            components={{
                              h1: ({ children }: { children?: React.ReactNode }) => <h1 className="font-bold text-base md:text-lg text-chiliz-primary mb-3 md:mb-4">{children}</h1>,
                              h2: ({ children }: { children?: React.ReactNode }) => <h2 className="font-bold text-base md:text-lg text-white mb-2 md:mb-3">{children}</h2>,
                              h3: ({ children }: { children?: React.ReactNode }) => <h3 className="font-bold text-base md:text-lg text-white/90 mb-1 md:mb-2">{children}</h3>,
                              p: ({ children }: { children?: React.ReactNode }) => <p className="font-normal text-white/80 mb-2 leading-relaxed text-sm md:text-base">{children}</p>,
                              ul: ({ children }: { children?: React.ReactNode }) => <ul className="space-y-1 mb-3 md:mb-4">{children}</ul>,
                              li: ({ children }: { children?: React.ReactNode }) => <li className="font-normal text-white/70 text-xs md:text-sm">{children}</li>,
                              code: ({ children }: { children?: React.ReactNode }) => (
                                <code className="bg-gray-800/60 px-1 md:px-2 py-1 rounded text-chiliz-primary text-xs md:text-sm font-mono break-all">
                                  {children}
                                </code>
                              ),
                              strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-white font-bold">{children}</strong>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-3 md:p-6 rounded-2xl border border-white/10 backdrop-blur-sm overflow-x-auto">
                          <ReactMarkdown 
                            className="prose prose-invert max-w-none text-sm md:text-base"
                            components={{
                              h1: ({ children }: { children?: React.ReactNode }) => <h1 className="font-bold text-base md:text-lg text-chiliz-primary mb-3 md:mb-4">{children}</h1>,
                              h2: ({ children }: { children?: React.ReactNode }) => <h2 className="font-bold text-base md:text-lg text-white mb-2 md:mb-3">{children}</h2>,
                              h3: ({ children }: { children?: React.ReactNode }) => <h3 className="font-bold text-base md:text-lg text-white/90 mb-1 md:mb-2">{children}</h3>,
                              p: ({ children }: { children?: React.ReactNode }) => <p className="font-normal text-white/80 mb-2 leading-relaxed text-sm md:text-base">{children}</p>,
                              ul: ({ children }: { children?: React.ReactNode }) => <ul className="space-y-1 mb-3 md:mb-4">{children}</ul>,
                              li: ({ children }: { children?: React.ReactNode }) => <li className="font-normal text-white/70 text-xs md:text-sm">{children}</li>,
                              code: ({ children }: { children?: React.ReactNode }) => (
                                <code className="bg-gray-800/60 px-1 md:px-2 py-1 rounded text-chiliz-primary text-xs md:text-sm font-mono break-all">
                                  {children}
                                </code>
                              ),
                              strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-white font-bold">{children}</strong>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                </div>
              ))}

              {isTyping && (
                <div className="mt-1 md:mt-2">
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar fallback="C" />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </div>
              )}

              {/* Action Buttons - Show only when first message */}
              {messages.length === 1 && !hasContractToExplore && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
                  {actionButtons.map((action, index) => (
                    <ActionButton
                      key={index}
                      icon={action.icon}
                      title={action.title}
                      description={action.description}
                      onClick={() => handleQuickAction(action.prompt)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          {/* Chat Input - Full width glass background */}
          <div className="bg-gray-900/40 backdrop-blur-sm p-3 md:p-6 safe-area-inset-bottom">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSendMessage(input);
                    setInput("");
                  }
                }} 
                className="relative"
              >
              <div className="relative rounded-2xl border border-white/20 bg-gray-900/80 backdrop-blur-sm focus-within:border-chiliz-primary/60 focus-within:shadow-lg focus-within:shadow-chiliz-primary/20 transition-all duration-300 hover:border-white/30">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={hasContractToExplore 
                    ? "Ask about this Chiliz contract..." 
                    : hasTextQuery 
                      ? "Continue your Chiliz exploration..."
                      : "Ask about Chiliz, fan tokens, or CHZ..."}
                  className="w-full border-0 bg-transparent px-4 md:px-6 py-3 md:py-4 pr-16 md:pr-20 focus:outline-none text-white placeholder:text-white/50 text-sm md:text-base min-h-[48px]"
                />
                <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
                  {/* Lightning Quick Action Button with Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSuggestedActions(!showSuggestedActions)}
                      className="h-8 w-8 md:h-10 md:w-10 bg-transparent border border-white/30 hover:border-chiliz-primary/60 hover:bg-chiliz-primary/10 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-chiliz-primary/20 min-h-[44px] min-w-[44px] backdrop-blur-sm"
                      title="Quick Actions"
                    >
                      <Zap className="h-4 w-4 md:h-5 md:w-5 text-chiliz-primary" />
                    </button>

                    {/* Quick Actions Dropdown */}
                    {showSuggestedActions && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl z-50">
                        <div className="space-y-2">
                          {suggestedActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setInput(action);
                                setShowSuggestedActions(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs rounded-lg bg-transparent border border-white/10 hover:border-chiliz-primary/30 hover:bg-chiliz-primary/10 transition-all duration-200 text-white/70 hover:text-white"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-r from-chiliz-primary to-red-600 hover:from-red-600 hover:to-chiliz-primary border-0 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none min-h-[44px] min-w-[44px]"
                  >
                    <Send className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </button>

                  {input.includes("execute") && walletAddress && (
                    <button
                      type="button"
                      onClick={handleExecute}
                      className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px]"
                    >
                      <Terminal className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>

              {/* Footer moved inside input area */}
              <div className="mt-3 md:mt-4 text-center space-y-1">
                <p className="text-xs text-red-500 font-semibold">#BuiltOnChiliz</p>
                <span className="text-xs text-white/30">
                  &copy; {new Date().getFullYear()} c-trace | Crafted with ❤️ by ch04niverse
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}