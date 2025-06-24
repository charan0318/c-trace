
"use client";

import { useState, useEffect } from "react";
import { Search, Send, Terminal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

// Import script to interact with Nebula API
import {
  createSession,
  queryContract,
  handleUserMessage,
  executeCommand,
} from "../../../scripts/Nebula.mjs";

import { useActiveAccount } from "thirdweb/react";

import {
  sendAndConfirmTransaction,
  prepareTransaction,
  defineChain,
} from "thirdweb";
import { client } from "../client";

export function BlockchainExplorer() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");
  const contractAddress = searchParams.get("searchTerm");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const account = useActiveAccount();
  const walletAddress = account?.address; // Get the wallet address

  // Check if we have contract details to explore
  const hasContractToExplore = contractAddress && chainId;

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await createSession("Blockchain Explorer Session");
        setSessionId(newSessionId);

        if (hasContractToExplore) {
          // Simulate typing animation
          setIsTyping(true);

          const contractDetails = await queryContract(
            contractAddress!,
            chainId!,
            newSessionId
          );
          setMessages([
            { role: "system", content: "Welcome to the Blockchain Explorer." },
            {
              role: "system",
              content:
                contractDetails || "No details available for this contract.",
            },
          ]);

          setIsTyping(false);
        } else {
          // Show welcome message when no contract is specified
          setMessages([
            {
              role: "system",
              content: `# Welcome to C-TRACE Blockchain Explorer! 🚀

I'm your AI-powered blockchain assistant, ready to help you explore the **Chiliz Chain** ecosystem.

## What can I help you with today?

### 🔍 **Smart Contract Analysis**
- Analyze any smart contract on Chiliz Chain
- Get detailed function listings and explanations
- Understand contract functionality and usage

### 💡 **General Blockchain Questions**
- Ask about Chiliz Chain features and capabilities
- Learn about DeFi protocols and token mechanics
- Get explanations about blockchain concepts

### ⚡ **Interactive Contract Execution**
- Execute read-only contract functions
- Get real-time data from smart contracts
- Interact with contracts safely (with wallet connected)

## How to get started:

1. **Ask me anything** about blockchain or Chiliz Chain
2. **Paste a contract address** to analyze a specific smart contract
3. **Connect your wallet** to interact with contracts

**Example questions you can ask:**
- "What is Chiliz Chain and how does it work?"
- "Explain the latest DeFi trends"
- "How do I interact with a specific token contract?"

Ready to explore? Just type your question below! 👇`
            },
          ]);
        }
      } catch (error) {
        console.error("Error creating session:", error);
        setMessages([
          {
            role: "system",
            content: "Welcome to C-TRACE Explorer! I'm ready to help you explore blockchain data. What would you like to know?",
          },
        ]);
      }
    };

    initSession();
  }, [contractAddress, chainId, hasContractToExplore]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    try {
      setIsTyping(true);
      
      if (hasContractToExplore) {
        // Handle contract-specific queries
        const response = await handleUserMessage(
          userMessage,
          sessionId,
          chainId!,
          contractAddress!
        );
        setMessages((prev) => [...prev, { role: "system", content: response }]);
      } else {
        // Handle general blockchain queries without contract context
        const response = await handleUserMessage(
          userMessage,
          sessionId,
          "88888", // Default to Chiliz Chain
          "" // No specific contract
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

  const handleExecute = async () => {
    if (!account?.address || !input.includes("execute") || !hasContractToExplore) return;

    const executeMessage = input.trim();

    // Add the "execute" message to the chat
    setMessages((prev) => [...prev, { role: "user", content: executeMessage }]);
    setInput("");

    try {
      setIsTyping(true);

      // Execute the command with Nebula API
      const executeResponse = await executeCommand(
        executeMessage,
        account.address,
        "default-user", // Optional user ID
        false, // Stream option
        chainId!,
        contractAddress!,
        sessionId
      );

      // Check if the response contains actions and a transaction to sign
      const action = executeResponse.actions?.find(
        (a: { type: string; data: string }) => a.type === "sign_transaction"
      );

      if (action) {
        const transactionData = JSON.parse(action.data); // Parse the transaction data

        // Prepare the transaction using thirdweb's prepareTransaction
        const preparedTransaction = prepareTransaction({
          to: transactionData.to,
          value: transactionData.value, // Value in hex
          data: transactionData.data, // Encoded function call
          chain: defineChain(transactionData.chainId), // Chain definition
          client, // Pass the initialized Thirdweb client
        });

        // Send and confirm the transaction using thirdweb
        const receipt = await sendAndConfirmTransaction({
          transaction: preparedTransaction,
          account,
        });

        // Add the transaction receipt hash to the chat
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Transaction sent successfully! Hash: ${receipt.transactionHash}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: "No transaction to sign in the response.",
          },
        ]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error executing transaction:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Failed to execute the command. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8 h-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chiliz-primary to-chiliz-secondary flex items-center justify-center shadow-lg shadow-chiliz-primary/25 mr-4">
            <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-white">Blockchain Explorer</h1>
        </div>

        {/* Chat Interface */}
        <div className="glass-panel h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "system" ? (
                  <div className="max-w-3xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({ children }) => (
                            <code className="bg-black/40 text-chiliz-secondary px-2 py-1 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md bg-gradient-to-r from-chiliz-primary to-chiliz-secondary rounded-2xl p-4 shadow-xl">
                    <span className="text-white font-medium">{message.content}</span>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-chiliz-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-white/70 text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={hasContractToExplore 
                    ? "Ask a question about this contract or execute a command..." 
                    : "Ask me anything about blockchain, Chiliz Chain, or paste a contract address to analyze..."}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-chiliz-primary focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
              
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-chiliz-primary to-chiliz-secondary hover:from-chiliz-secondary hover:to-chiliz-primary text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
              
              {input.includes("execute") && hasContractToExplore && (
                <button
                  onClick={handleExecute}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Terminal className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
