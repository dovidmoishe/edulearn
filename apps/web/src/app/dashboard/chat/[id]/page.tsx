"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Chat from '../../../../../components/Chat/Page'
import { ChatService, Message } from '../../../../../services/chat.service'
import useUserStore from '../../../../../core/userState'
import { useRouter } from 'next/navigation'

const ChatPage = () => {
  const params = useParams()
  const { user } = useUserStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [chatTitle, setChatTitle] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const chatService = new ChatService()
  const router = useRouter()
  
  const chatId = Array.isArray(params.id) ? params.id[0] : params.id || ''

  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId || !user?.id) {
       router.push("/dashboard") 
      }
      
      setLoading(true)
      try {
        const chatMessages = await chatService.getMessagesInChat(chatId)
        setMessages(chatMessages || [])
        

        const chats = await chatService.getHistory(user?.id as unknown as string)
        const currentChat = chats.find((chat) => chat.id === chatId)
        setChatTitle(currentChat?.title || 'New Chat')
      } catch (error) {
        setMessages([])
        setChatTitle('New Chat')
      } finally {
        setLoading(false)
      }
    }

    loadChatData()
  }, [chatId, user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
      </div>
    )
  }

  return (
    <Chat 
      chatId={chatId}
      title={chatTitle}
      initialMessages={messages}
    />
  )
}

export default ChatPage