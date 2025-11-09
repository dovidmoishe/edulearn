"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CaretRight from "@/../public/assets/icons/dark/CaretRight.png";
import pencil from "@/../public/assets/icons/dark/pencil.png";
import EduLearn from "@/../public/assets/images/logo.png";
import EduLearnLogo from "@/../public/assets/images/edulearn.png";
import attachment from "@/../public/assets/icons/dark/attachement.png";
import send from "@/../public/assets/icons/dark/send.png";
import brain03 from "@/../public/assets/icons/brain03.png"
import deleteIcon from "@/../public/assets/icons/delete.png"
import brain01 from "@/../public/assets/icons/brain.png"
import deleteIcon01 from "@/../public/assets/icons/dark/delete.png"
import Image from "next/image";
import { AIService, Message } from "../../services/ai.service";
import { ChatService } from "../../services/chat.service";
import useUserStore from "../../core/userState";
import ChatDrawer from "./ChatDrawer";
import MessageItem from "./MessageItem";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #E0E0E0;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #CCCCCC;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
`;

type Props = {
  title?: string;
  initialMessages?: Array<Message>;
  chatId: string;
};

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Chat = ({ title, initialMessages = [], chatId }: Props) => {
  const { user } = useUserStore();
  const router = useRouter();
  const aiService = new AIService();
  const chatService = new ChatService();

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeChatId, setActiveChatId] = useState(chatId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [waitingForStream, setWaitingForStream] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const tokenQueueRef = useRef<string[]>([]);
  const processingTokensRef = useRef(false);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const messageContentRef = useRef<Map<string, string>>(new Map());

  const resetChatState = useCallback(() => {
    setMessages([]);
    setIsGenerating(false);
    setInputText("");
    setShowScrollButton(false);
    setDrawerOpen(false);
    scrollToBottom();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current && !isTransitioning) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [isTransitioning]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isCloseToBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isCloseToBottom && messages.length > 2);
    },
    [messages.length]
  );


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (textToSend === "" || isGenerating || isTransitioning) return;

    if (streamCleanupRef.current) {
      streamCleanupRef.current();
      streamCleanupRef.current = null;
    }

    setInputText("");

    const newMessage: Message = {
      id: generateUUID(),
      role: "user",
      content: textToSend,
      createdAt: new Date(),
      chatId: activeChatId,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);
    setWaitingForStream(true);

    const assistantMessageId = generateUUID();
    let messageCreated = false;

    try {
      const cleanup = await aiService.generateMessagesStream(
        {
          messages: updatedMessages,
          chatId: activeChatId,
          userId: user?.id as string,
        },
        (token: string, type?: string) => {
          if (!messageCreated) {
            setWaitingForStream(false);
            setStreamingMessageId(assistantMessageId);
            messageContentRef.current.set(assistantMessageId, '');
            setMessages((currentMessages) => {
              const messagesCopy = [...currentMessages];
              const assistantMessage: Message = {
                id: assistantMessageId,
                role: "assistant",
                content: "",
                createdAt: new Date(),
                chatId: activeChatId,
              };
              messagesCopy.push(assistantMessage);
              return messagesCopy;
            });
            messageCreated = true;
          }
          
          const currentContent = messageContentRef.current.get(assistantMessageId) || '';
          const newContent = currentContent + token;
          messageContentRef.current.set(assistantMessageId, newContent);
          
          setMessages((currentMessages) => {
            const messagesCopy = [...currentMessages];
            const messageIndex = messagesCopy.findIndex(msg => msg && msg.id === assistantMessageId);
            if (messageIndex !== -1) {
              messagesCopy[messageIndex].content = newContent;
            }
            return messagesCopy;
          });
        },
        (fullMessage: Message) => {
          messageContentRef.current.delete(assistantMessageId);
          setIsGenerating(false);
          setStreamingMessageId(null);
          scrollToBottom();
        },
        (error: Error) => {
          console.error("Error generating message:", error);
          setInputText(textToSend);
          
          tokenQueueRef.current = [];
          processingTokensRef.current = false;
          messageContentRef.current.delete(assistantMessageId);
          
          if (messageCreated) {
            setMessages((currentMessages) => 
              currentMessages.filter(msg => msg.id !== assistantMessageId)
            );
          }
          
          setIsGenerating(false);
          setWaitingForStream(false);
          setStreamingMessageId(null);
        }
      );

      streamCleanupRef.current = cleanup || null;
    } catch (error: unknown) {
      console.error("Error generating message:", error);
      setInputText(textToSend);
      setIsGenerating(false);
      setWaitingForStream(false);
      setStreamingMessageId(null);
      
      tokenQueueRef.current = [];
      processingTokensRef.current = false;
      messageContentRef.current.delete(assistantMessageId);
      
      if (messageCreated) {
        setMessages((currentMessages) => 
          currentMessages.filter(msg => msg.id !== assistantMessageId)
        );
      }
    }
  };

  const handleCreateNewChat = useCallback(() => {
    const newChatId = generateUUID();
    setDrawerOpen(false);
    router.push(`/dashboard/chat/${newChatId}`);
  }, [router]);

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      if (isGenerating || isTransitioning) return;
      handleSendMessage(suggestion);
    },
    [isGenerating, isTransitioning, handleSendMessage]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChatId || isTransitioning) return;

    try {
      await chatService.deleteChat(activeChatId);
      router.push("/dashboard/chat");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleStartQuiz = async () => {
    if (!activeChatId || !user?.id) return;

    try {
      await aiService.generateQuiz({ chatId: activeChatId, userId: user.id });
      router.push("/quiz");
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      setIsTransitioning(true);
      resetChatState();
      setActiveChatId(chatId);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }
  }, [chatId, activeChatId, resetChatState]);


  useEffect(() => {
    if (!isTransitioning && activeChatId && initialMessages.length > 0) {
      const relevantMessages = initialMessages.filter(
        (msg) => msg.chatId === activeChatId
      );
      setMessages(relevantMessages);
    } else if (!isTransitioning && initialMessages.length === 0) {
      setMessages([]);
    }
  }, [activeChatId, initialMessages, isTransitioning]);

  useEffect(() => {
    if (messages.length > 0 && !isTransitioning) {
      scrollToBottom();
    }
  }, [messages, isTransitioning, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
        streamCleanupRef.current = null;
      }
    };
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingSuggestions(true);
      const fetchedSuggestions = await aiService.generateSuggestions({
        userId: user.id,
      });
      setSuggestions(fetchedSuggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([
        "Teach me about DeFi",
        "Learn about RWAs",
        "Blockchain basics",
      ]);
      } finally {
      setLoadingSuggestions(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && messages.length === 0) {
      fetchSuggestions();
    }
  }, [user?.id, fetchSuggestions, messages.length]);


  if (isTransitioning) {
    return (
      <div className="rounded-[24px] bg-[#131313] border border-[#2E3033] py-[12px] px-[24px] flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
        <p className="text-[#E0E0E0] mt-4">Loading chat...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{scrollbarStyles}</style>
      <div className="flex h-screen relative">
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setDrawerOpen(false)}
            style={{
              animation: 'fadeIn 0.3s ease-out'
            }}
          />
        )}

        <div className={`
          fixed md:relative z-50 h-full bg-[#0A0A0A] border-r border-[#2E3033] flex flex-col
          transform transition-all duration-300 ease-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${drawerOpen ? 'block' : 'hidden md:block'}
        `}
        style={{ width: '256px' }}
        >
          <ChatDrawer onClose={() => setDrawerOpen(false)} />
        </div>

        
        <div className="flex-1 rounded-[24px] bg-[#131313] border border-[#2E3033] py-[12px] px-[24px] flex flex-col relative min-h-0">
        <div className="py-[16px] flex items-center justify-between border-b border-[#2E3033]">
          <div className="flex items-center gap-[16px]">
            <button
              className="p-[8px] border border-[#2E3033] rounded-[9px] hover:bg-[#1A1A1A] transition-colors md:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <svg className="w-6 h-6 text-[#E0E0E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-[#E0E0E0] text-lg font-medium truncate">
              {title || "AI Tutor Chat"}
            </h1>
            </div>
            <div className="flex items-center gap-[16px]">
            {messages.length > 0 && (
              <>
                <button
                  className="hidden md:flex cursor-pointer px-[24px] py-[10px] leading-[24px] font-[700] bg-[#00FF80] items-center gap-[12px] text-[#000] rounded-[8px] hover:bg-[#00E070] transition-colors text-sm"
                  onClick={handleStartQuiz}
                >
                  <Image src={brain03} alt="Start quiz" width={24} height={24} />
                  Start Quiz
                </button>
                <button
                  className="hidden md:flex cursor-pointer px-[24px] py-[10px] items-center leading-[24px] font-[700] gap-[12px] border border-[#00FF80] text-[#00FF80] rounded-[8px]"
                  onClick={handleDeleteChat}
                >
                  <Image src={deleteIcon} alt="Delete chat" width={24} height={24} />
                  Delete Chat
                </button>
                
                <button
                  className="md:hidden flex items-center justify-center w-[40px] h-[40px] border border-[#2E3033] bg-[#131313] rounded-[7.736px] hover:bg-[#1A1A1A] transition-colors"
                  onClick={handleStartQuiz}
                >
                  <Image src={brain01} alt="Start quiz" width={20} height={20} />
                </button>
                <button
                  className="md:hidden flex items-center justify-center w-[40px] h-[40px] border border-[#2E3033] bg-[#131313] rounded-[7.736px] hover:bg-[#1A1A1A] transition-colors"
                  onClick={handleDeleteChat}
                >
                  <Image src={deleteIcon01} alt="Delete chat" width={20} height={20} />
                </button>
              </>
            )}
            {messages.length === 0 && (
              <button
                className="p-[8px] border border-[#2E3033] rounded-[9px] hover:bg-[#1A1A1A] transition-colors"
                onClick={handleCreateNewChat}
              >
                <Image src={pencil} alt="New chat" width={24} height={24} />
              </button>
            )}
            </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center flex-col gap-[80px]">
                <Image src={EduLearn} alt="EduLearn" width={190} height={39} />
            
                <div className="flex items-center gap-[12px]">
                  {loadingSuggestions && (
                    <div className="text-[#888] text-sm">
                      Loading suggestions...
                    </div>
                  )}

                  {!loadingSuggestions && suggestions.length > 0 && (
                    <div className="flex items-center gap-[4px] md:gap-[8px] max-w-xs md:max-w-md flex-wrap justify-center">
                        {suggestions.map((suggestion, index) => (
                        <button
                                key={index}
                          onClick={() => handleSuggestionPress(suggestion)}
                                className="bg-[#1A1A1A] border border-[#2E3033] rounded-[6px] md:rounded-[8px] px-[8px] md:px-[12px] py-[6px] md:py-[8px] text-[#E5E5E5] text-xs md:text-sm hover:bg-[#222] hover:border-[#444] cursor-pointer transition-colors flex-shrink-0"
                            >
                                {suggestion}
                        </button>
                        ))}
                    </div>
                )}
                
                  {!loadingSuggestions &&
                    suggestions.length === 0 &&
                    user?.id && (
                      <div className="text-[#888] text-sm">
                        No suggestions available
                      </div>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 relative min-h-0">
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E0E0E0 transparent'
                }}
              >
                {messages.map((message) => {
                  const isStreaming = message.id === streamingMessageId;
                  return (
                    <MessageItem 
                      key={message.id} 
                      message={message}
                      isStreaming={isStreaming}
                    />
                  );
                })}

                {waitingForStream && (
                  <div className="flex items-start gap-3">
                    <Image src={EduLearnLogo} alt="EduLearn" width={24} height={24} />
                    <div className="bg-[#1A1A1A] rounded-lg p-4 max-w-[75%] rounded-tl-sm">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[#E0E0E0] text-lg font-normal inline-block"
                          style={{
                            animation: 'blink 1s infinite'
                          }}
                        >
                          ▊
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
            </div>

              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute right-4 bottom-4 w-10 h-10 bg-[#00FF80] rounded-full flex items-center justify-center shadow-lg hover:bg-[#00E070] transition-colors z-10"
                >
                  <Image
                    src={CaretRight}
                    alt="Scroll to bottom"
                    width={24}
                    height={24}
                    className="transform rotate-90"
                  />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-[16px] pt-4">
            <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-[#2E3033] bg-[#0D0D0D]">
            <Image src={attachment} alt="attachment" width={24} height={24} />
            </div>
            
            <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
              disabled={isGenerating || isTransitioning}
              rows={1}
              className="w-full min-h-[48px] pl-[20px] pr-[64px] py-[12px] rounded-[12px] border border-[#2E3033] bg-[#0D0D0D] text-[#E5E5E5] placeholder:text-[#666] focus:outline-none focus:border-[#444] transition-colors resize-none"
              style={{
                maxHeight: "120px",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
                />
                <button 
              className={`absolute right-[16px] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[32px] h-[32px] transition-opacity ${
                inputText.trim() === "" || isGenerating || isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-80 cursor-pointer"
              }`}
              onClick={() => handleSendMessage()}
              disabled={
                inputText.trim() === "" || isGenerating || isTransitioning
              }
            >
              <Image src={send} alt="send" width={24} height={24} />
                </button>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;
