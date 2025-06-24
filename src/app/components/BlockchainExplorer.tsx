
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
              content: "WELCOME_INTERACTIVE"
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

  const handleQuickAction = (prompt: string, autoSubmit: boolean = false) => {
    setInput(prompt);
    if (autoSubmit) {
      // Auto-submit after a brief delay to allow input to update
      setTimeout(() => {
        handleSend();
      }, 100);
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
                  message.content === "WELCOME_INTERACTIVE" ? (
                    <div className="max-w-4xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                      {/* Welcome Header */}
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                          Welcome to C-TRACE Blockchain Explorer! 🚀
                        </h2>
                        <p className="text-white/80 text-lg mb-2">
                          I'm your AI-powered blockchain assistant, ready to help you explore the{' '}
                          <span className="text-chiliz-primary font-semibold">Chiliz Chain</span> ecosystem.
                        </p>
                        <p className="text-white/70">What can I help you with today?</p>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Smart Contract Analysis Button */}
                        <button
                          onClick={() => handleQuickAction("Analyze this smart contract on Chiliz Chain: [paste address]")}
                          className="group bg-gradient-to-br from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-400/20 hover:border-blue-400/40 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          <div className="text-3xl mb-3">🔍</div>
                          <h3 className="text-white font-semibold text-lg mb-2">Smart Contract Analysis</h3>
                          <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                            Analyze smart contracts with detailed function listings and explanations
                          </p>
                        </button>

                        {/* General Blockchain Questions Button */}
                        <button
                          onClick={() => handleQuickAction("What are the main features of the Chiliz Chain?", true)}
                          className="group bg-gradient-to-br from-yellow-600/20 to-orange-500/20 hover:from-yellow-600/30 hover:to-orange-500/30 border border-yellow-400/20 hover:border-yellow-400/40 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
                        >
                          <div className="text-3xl mb-3">💡</div>
                          <h3 className="text-white font-semibold text-lg mb-2">General Blockchain Questions</h3>
                          <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                            Learn about Chiliz Chain features, DeFi protocols, and blockchain concepts
                          </p>
                        </button>

                        {/* Interactive Contract Execution Button */}
                        <button
                          onClick={() => handleQuickAction("Help me interact with a smart contract on Chiliz (read-only functions).")}
                          className="group bg-gradient-to-br from-purple-600/20 to-pink-500/20 hover:from-purple-600/30 hover:to-pink-500/30 border border-purple-400/20 hover:border-purple-400/40 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          <div className="text-3xl mb-3">⚡</div>
                          <h3 className="text-white font-semibold text-lg mb-2">Interactive Contract Execution</h3>
                          <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                            Execute read-only functions and get real-time data from smart contracts
                          </p>
                        </button>
                      </div>

                      {/* Quick Start Tips */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-white/60 text-sm text-center">
                          <span className="text-chiliz-secondary font-medium">Quick tip:</span> You can also paste a contract address directly or ask any blockchain-related question!
                        </p>
                      </div>
                    </div>
                  ) : (
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
                  )
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
                    <span className="text-white/70 text-sm"> C-Trace is thinking... </span>
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
