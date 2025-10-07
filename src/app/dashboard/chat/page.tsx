"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const ChatIndexPage = () => {
  const router = useRouter()

  useEffect(() => {
    const newChatId = generateUUID()
    router.replace(`/dashboard/chat/${newChatId}`)
  }, [router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF80]"></div>
    </div>
  )
}

export default ChatIndexPage