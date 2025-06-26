"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Send, Terminal, ArrowDown, Copy, Edit, Zap, FileText, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Silk from '@/app/components/ui/Silk';

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
      "relative rounded-2xl text-sm backdrop-blur-sm border transition-all duration-300 hover:shadow-lg group-hover:shadow-md animate-fade-in",
      variant === "sent"
        ? "bg-gradient-to-br from-chiliz-primary/20 to-red-600/20 border-chiliz-primary/30 text-white ml-auto px-4 py-3"
        : "bg-transparent border-transparent text-white p-0"
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

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const account = useActiveAccount();
  const walletAddress = account?.address;

  // Check if we have contract details to explore
  const hasContractToExplore = contractAddress && chainId;

  const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll(messages.length);

  const actionButtons = [
    {
      icon: Search,
      title: "Analyze Chiliz Contract",
      description: "Explore any Chiliz smart contract. Uncover methods, data, and fan token logic instantly",
      prompt: "Analyze this smart contract on Chiliz Chain: [paste address]"
    },
    {
      icon: TrendingUp,
      title: "Fan Token Analysis",
      description: "Track fan token performance and discover emerging trends across the Chiliz ecosystem",
      prompt: "What are the main features of the Chiliz Chain and fan tokens?"
    },
    {
      icon: FileText,
      title: "Chiliz Research",
      description: "Investigate the CHZ token, its on-chain utility, and the network of sports organizations using it",
      prompt: "Help me understand the Chiliz ecosystem and its sports clubs using it"
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
        console.log("📋 URL Parameters:", { contractAddress, chainId, hasContractToExplore });
        
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
        } else {
          console.log("💬 Loading default welcome message");
          setMessages([
            {
              role: "system",
              content: "Welcome to C-TRACE 🚀 I'm your AI assistant for exploring the Chiliz blockchain and ecosystem. What would you like to discover about Chiliz today?",
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
  }, [contractAddress, chainId, hasContractToExplore]);

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
          "88888",
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

      const executeResponse = await executeCommand(
        executeMessage,
        account.address,
        "default-user",
        false,
        chainId || "88888",
        contractAddress || "",
        sessionId
      );

      const action = executeResponse.actions?.find(
        (a: { type: string; data: string }) => a.type === "sign_transaction"
      );

      if (action) {
        const transactionData = JSON.parse(action.data);

        const preparedTransaction = prepareTransaction({
          to: transactionData.to,
          value: transactionData.value,
          data: transactionData.data,
          chain: defineChain(transactionData.chainId),
          client,
        });

        const receipt = await sendAndConfirmTransaction({
          transaction: preparedTransaction,
          account,
        });

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

  const suggestedActions = [
    "Explain fan token mechanics",
    "Check CHZ gas prices",
    "Analyze Chiliz transaction",
    "What is the Latest Block?",
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-10">
      {/* Silk Background */}
      <div className="absolute inset-0" style={{ zIndex: -10 }}>
        <Silk
          speed={2}
          scale={1.5}
          color="#2a2a4e"
          noiseIntensity={0.6}
          rotation={0}
        />
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
          {/* Suggested Actions */}
          {messages.length > 1 && (
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto p-3 md:p-6 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(action)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-transparent border border-white/10 hover:border-chiliz-primary/30 hover:bg-chiliz-primary/10 transition-all duration-200 text-white/50 hover:text-white whitespace-nowrap min-h-[32px]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input - Full width glass background */}
          <div className="bg-gray-900/40 backdrop-blur-sm p-3 md:p-6 safe-area-inset-bottom">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }} 
                className="relative"
              >
              <div className="relative rounded-2xl border border-white/20 bg-gray-900/80 backdrop-blur-sm focus-within:border-chiliz-primary/60 focus-within:shadow-lg focus-within:shadow-chiliz-primary/20 transition-all duration-300 hover:border-white/30">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={hasContractToExplore 
                    ? "Ask about this Chiliz contract..." 
                    : "Ask about Chiliz, fan tokens, or CHZ..."}
                  className="w-full border-0 bg-transparent px-4 md:px-6 py-3 md:py-4 pr-16 md:pr-20 focus:outline-none text-white placeholder:text-white/50 text-sm md:text-base min-h-[48px]"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
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
              <div className="mt-3 md:mt-4 text-center">
                <span className="text-xs text-white/30">
                  &copy; {new Date().getFullYear()} c-trace | Crafted with ❤ from ch04niverse
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}