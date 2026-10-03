"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useUserStore from '../../core/userState'
import { ChatService, Chat } from '../../services/chat.service'
import CaretRight from "@/../public/assets/icons/dark/CaretRight.png"
import pencil from "@/../public/assets/icons/pencilEmerald.png"

const drawerScrollbarStyles = `
  .drawer-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .drawer-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .drawer-scrollbar::-webkit-scrollbar-thumb {
    background: #E0E0E0;
    border-radius: 10px;
  }
  
  .drawer-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #CCCCCC;
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .drawer-content {
    animation: slideInFromLeft 0.3s ease-out;
  }

  .drawer-header {
    animation: slideDown 0.4s ease-out;
  }

  .drawer-search {
    animation: slideDown 0.5s ease-out;
  }

  .drawer-chat-item {
    animation: fadeIn 0.4s ease-out forwards;
    opacity: 0;
  }

  .drawer-section {
    animation: fadeIn 0.3s ease-out;
  }
`;

interface ChatDrawerProps {
  onClose: () => void
}

const groupChatsByRecency = (chats: Chat[]) => {
  const now = new Date()
  const oneDayAgo = new Date(now)
  oneDayAgo.setDate(now.getDate() - 1)
  
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)
  
  const recent = chats.filter(chat => new Date(chat.createdAt) >= oneDayAgo)
  const lastWeek = chats.filter(chat => 
    new Date(chat.createdAt) < oneDayAgo && new Date(chat.createdAt) >= sevenDaysAgo
  )
  const lastMonth = chats.filter(chat => 
    new Date(chat.createdAt) < sevenDaysAgo && new Date(chat.createdAt) >= thirtyDaysAgo
  )
  const older = chats.filter(chat => new Date(chat.createdAt) < thirtyDaysAgo)
  
  return { recent, lastWeek, lastMonth, older }
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ onClose }) => {
  const { user } = useUserStore()
  const router = useRouter()
  const chatService = new ChatService()
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats
    
    return chats.filter(chat => 
      chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.title === null
    )
  }, [chats, searchQuery])

  const groupedChats = useMemo(() => {
    return groupChatsByRecency(filteredChats)
  }, [filteredChats])

  const goToChat = useCallback(async (id: string) => {
    if (isNavigating) return
    
    setIsNavigating(true)
    onClose()
    
    setTimeout(() => {
      router.push(`/dashboard/chat/${id}`)
      setIsNavigating(false)
    }, 150)
  }, [onClose, isNavigating, router])

  const handleCreateNewChat = useCallback(async () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    onClose()
    
    const newChatId = generateUUID()
    
    setTimeout(() => {
      router.push(`/dashboard/chat/${newChatId}`)
      setIsNavigating(false)
    }, 150)
  }, [onClose, isNavigating, router])

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true)
      try {
        const chatList = await chatService.getHistory(user?.id as string)
        setChats(chatList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      } catch (error) {
        console.error("Error fetching chats:", error)
        setChats([])
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user?.id) {
      fetchChats()
    }
  }, [user?.id])

  const renderChatSection = (title: string, sectionChats: Chat[]) => {
    if (sectionChats.length === 0) return null
    
    return (
      <div key={title} className="mb-4 drawer-section">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider">
            {title}
          </h3>
          <button className="text-[#888] hover:text-[#fff] transition-colors">
            <Image src={CaretRight} alt="Expand" width={12} height={12} className="transform rotate-90" />
          </button>
        </div>
        {sectionChats.map((chat, index) => (
          <button
            key={chat.id}
            onClick={() => goToChat(chat.id)}
            disabled={isNavigating}
            className={`
              w-full flex items-center justify-between px-4 py-3 
              hover:bg-[#1A1A1A] transition-colors text-left group
              drawer-chat-item
              ${isNavigating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#E5E5E5] truncate group-hover:text-white">
                {chat.title || "New Chat"}
              </p>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <style jsx>{drawerScrollbarStyles}</style>
      <div className="drawer-content flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#0A0A0A]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#2E3033] p-4 md:hidden drawer-header">
          <h2 className="text-lg font-medium text-white">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-search shrink-0 border-b border-[#2E3033] p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleCreateNewChat}
            disabled={isNavigating}
            className="w-full flex items-center justify-center gap-[12px] border border-[#00FF80] text-[#00FF80] px-[16px] py-[10px] rounded-lg font-medium"
          >
           <div className="flex items-center gap-[12px]">
            <Image src={pencil} alt="New chat" width={16} height={16} />
            New Chat
           </div>
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isNavigating}
            className="w-full bg-transparent border border-[#00FF80] rounded-lg py-[10px] px-[16px] text-[#00FF80] placeholder:text-[#00FF80] text-sm focus:outline-none transition-colors"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#00FF80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="drawer-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E0E0E0 transparent'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00FF80]"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-[#888] text-sm mb-2">No chat history yet</p>
            <p className="text-[#666] text-xs">Start a new conversation!</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-[#888] text-sm mb-2">No chats found</p>
            <p className="text-[#666] text-xs">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="py-2">
            {renderChatSection("Recent", groupedChats.recent)}
            {renderChatSection("Last 7 Days", groupedChats.lastWeek)}
            {renderChatSection("Last 30 Days", groupedChats.lastMonth)}
            {renderChatSection("Older", groupedChats.older)}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default ChatDrawer