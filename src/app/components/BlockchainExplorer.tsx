
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Send, Terminal, ArrowDown, Copy, Edit, Zap, FileText, TrendingUp } from "lucide-react";
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

// Utility function
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Auto-scroll hook
interface ScrollState {
  isAtBottom: boolean;
  autoScrollEnabled: boolean;
}

function useAutoScroll(content?: React.ReactNode) {
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
    if (!element || !element.parentNode) return;

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
      if (element && element.parentNode && scrollHandler) {
        try {
          element.removeEventListener("scroll", scrollHandler);
        } catch (error) {
          // Ignore removal errors
        }
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !scrollElement.parentNode) return;

    const currentHeight = scrollElement.scrollHeight;
    const hasNewContent = currentHeight !== lastContentHeight.current;

    if (hasNewContent && scrollState.autoScrollEnabled) {
      // Cancel any pending animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use timeout instead of requestAnimationFrame for better stability
      timeoutRef.current = setTimeout(() => {
        if (scrollRef.current && scrollRef.current.parentNode) {
          scrollToBottom(lastContentHeight.current === 0);
        }
      }, 50);
      
      lastContentHeight.current = currentHeight;
    }
  }, [content, scrollState.autoScrollEnabled, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
      "flex gap-4 max-w-[85%] group",
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
      "relative rounded-2xl px-4 py-3 text-sm backdrop-blur-sm border transition-all duration-300 hover:shadow-lg group-hover:shadow-md",
      variant === "sent"
        ? "bg-gradient-to-br from-chiliz-primary/20 to-red-600/20 border-chiliz-primary/30 text-white ml-auto"
        : "bg-gray-900/60 border-white/20 text-white"
    )}>
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-white/70 text-sm ml-2">C-TRACE is analyzing...</span>
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
      className="group relative p-6 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-white/20 hover:border-chiliz-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 hover:bg-gray-900/60 text-left w-full"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-chiliz-primary/20 to-red-600/20 border border-chiliz-primary/30 group-hover:from-chiliz-primary/30 group-hover:to-red-600/30 transition-all duration-300">
          <Icon className="h-6 w-6 text-chiliz-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1 group-hover:text-chiliz-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
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
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const account = useActiveAccount();
  const walletAddress = account?.address;

  // Check if we have contract details to explore
  const hasContractToExplore = contractAddress && chainId;

  const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll(messages);

  const actionButtons = [
    {
      icon: Search,
      title: "Analyze Chiliz Contract",
      description: "Deep dive into Chiliz smart contracts and fan token functionality",
      prompt: "Analyze this smart contract on Chiliz Chain: [paste address]"
    },
    {
      icon: TrendingUp,
      title: "Fan Token Analysis",
      description: "Get insights on fan token performance and Chiliz ecosystem trends",
      prompt: "What are the main features of the Chiliz Chain and fan tokens?"
    },
    {
      icon: FileText,
      title: "Chiliz Research",
      description: "Research Chiliz protocol, CHZ token, and sports partnerships",
      prompt: "Help me understand the Chiliz ecosystem and its sports partnerships"
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
              content: "Welcome to C-TRACE! I'm your AI assistant for exploring the Chiliz blockchain and ecosystem. What would you like to discover about Chiliz today?",
            },
          ]);
        }
      } catch (error) {
        console.error("❌ Error in session initialization:", error);
        setMessages([
          {
            role: "system",
            content: "Welcome to C-TRACE! I'm ready to help you explore Chiliz blockchain and fan token data. What would you like to discover?",
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
    if (!account?.address || !input.includes("execute") || !hasContractToExplore) return;

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
        chainId!,
        contractAddress!,
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
    "Show sports partnerships"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-[-10] opacity-20"
        style={{
          backgroundImage: `radial-gradient(#1a1a2e 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, var(--tw-bg-opacity), transparent)'
        }}
      />

      {/* Main Content */}
      <div className="h-full flex flex-col">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex flex-col w-full h-full px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 transition-colors"
            ref={scrollRef}
          >
            <div className="flex flex-col min-h-full pb-6 space-y-6 max-w-4xl mx-auto w-full">
              {messages.map((message, index) => (
                <ChatBubble key={index} variant={message.role === "user" ? "sent" : "received"}>
                  <ChatBubbleAvatar fallback={message.role === "user" ? "U" : "C"} />
                  <ChatBubbleMessage variant={message.role === "user" ? "sent" : "received"}>
                    {message.role === "system" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            code: ({ children }) => (
                              <code className="bg-black/40 text-chiliz-primary px-2 py-1 rounded text-sm font-mono">
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
                    ) : (
                      message.content
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {isTyping && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="C" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}

              {/* Action Buttons - Show only when first message */}
              {messages.length === 1 && !hasContractToExplore && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
        <div>
          {/* Suggested Actions */}
          {messages.length > 1 && (
            <div className="max-w-4xl mx-auto p-6 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(action)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-transparent border border-white/10 hover:border-chiliz-primary/30 hover:bg-chiliz-primary/10 transition-all duration-200 text-white/50 hover:text-white whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input - Full width glass background */}
          <div className="bg-gray-900/40 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
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
                    ? "Ask about this Chiliz contract or execute a command..." 
                    : "Ask about Chiliz, fan tokens, or CHZ ecosystem..."}
                  className="w-full border-0 bg-transparent px-6 py-4 pr-20 focus:outline-none text-white placeholder:text-white/50 text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-10 w-10 bg-gradient-to-r from-chiliz-primary to-red-600 hover:from-red-600 hover:to-chiliz-primary border-0 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                  
                  {input.includes("execute") && hasContractToExplore && (
                    <button
                      type="button"
                      onClick={handleExecute}
                      className="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Terminal className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>

              {/* Footer moved inside input area */}
              <div className="mt-4 text-center">
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
