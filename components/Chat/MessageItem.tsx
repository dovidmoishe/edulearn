"use client"
import React from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { IoCopy, IoShareSocial, IoFlag } from 'react-icons/io5'
import { Message } from '../../services/ai.service'
import useUserStore from '../../core/userState'
import logo from "@/../public/assets/images/edulearn.png"

const cursorStyles = `
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
`;

interface MessageItemProps {
  message: Message
  isStreaming?: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const { theme } = useUserStore()
  const isUser = message.role === 'user'

  const handleCopyMessage = async () => {
    try {
      const messageText = getMessageContent()
      await navigator.clipboard.writeText(messageText)
      // You could add a toast notification here
      console.log('Message copied to clipboard')
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const handleShareMessage = async () => {
    try {
      const messageText = getMessageContent()
      if (navigator.share) {
        await navigator.share({
          title: 'AI Response',
          text: messageText,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(messageText)
        console.log('Message copied to clipboard (fallback)')
      }
    } catch (error) {
      console.error('Failed to share message:', error)
    }
  }

  const handleReportMessage = async () => {
    try {
      const messageText = getMessageContent()
      const subject = encodeURIComponent('Report AI Response')
      const body = encodeURIComponent(
        `I would like to report the following AI response:\n\n"${messageText}"\n\nReason for report:\n\n`
      )
      const mailtoUrl = `mailto:support@edulearn.com?subject=${subject}&body=${body}`
      window.open(mailtoUrl, '_blank')
    } catch (error) {
      console.error('Failed to open email client:', error)
    }
  }

  const getMessageContent = () => {
    if (typeof message.content === 'string') {
      return message.content
    } else if (
      message.content &&
      typeof message.content === 'object' &&
      'text' in message.content
    ) {
      return (message.content).text as string
    }
    return ''
  }

  return (
    <>
      <style jsx>{cursorStyles}</style>
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="">
          <Image src={logo} alt="AI" width={27} height={27} />
        </div>
      )}

      <div className={`
        max-w-[75%] rounded-lg p-4
        ${isUser 
          ? 'bg-[#0D0D0D] border border-[#2E3033] rounded-tr-sm' 
          : 'bg-[#1A1A1A] rounded-tl-sm'
        }
      `}>
        <div className="prose prose-invert prose-sm max-w-none">
          {(() => {
            const content = getMessageContent();
            
            if (!content || content.trim().length === 0) {
              if (isStreaming && !isUser) {
                return (
                  <span 
                    className="text-[#E0E0E0] text-lg font-normal inline-block"
                    style={{
                      animation: 'blink 1s infinite'
                    }}
                  >
                    ▊
                  </span>
                );
              }
              return (
                <span className="text-[#E0E0E0] opacity-50">
                  ...
                </span>
              );
            }
            
            return (
              <>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-[#E0E0E0] mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    h1: ({ children }) => <h1 className="text-[#E0E0E0] text-lg font-bold mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-[#E0E0E0] text-base font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-[#E0E0E0] text-sm font-bold mb-2">{children}</h3>,
                    strong: ({ children }) => <strong className="text-[#E0E0E0] font-bold">{children}</strong>,
                    em: ({ children }) => <em className="text-[#E0E0E0] italic">{children}</em>,
                    ul: ({ children }) => <ul className="text-[#E0E0E0] list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="text-[#E0E0E0] list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-[#E0E0E0]">{children}</li>,
                    code: ({ children, className }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-[#2E3033] text-[#00FF80] px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className="block bg-[#2E3033] text-[#E0E0E0] p-3 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-[#2E3033] text-[#E0E0E0] p-3 rounded-lg text-sm overflow-x-auto mb-2 font-mono">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#00FF80] pl-4 text-[#E0E0E0] italic mb-2 bg-[#1A1A1A]/50 py-2 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a 
                        href={href} 
                        className="text-[#00FF80] hover:text-[#00E070] underline underline-offset-2" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-2">
                        <table className="min-w-full border border-[#2E3033] rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-[#2E3033] px-3 py-2 bg-[#1A1A1A] text-[#E0E0E0] font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-[#2E3033] px-3 py-2 text-[#E0E0E0]">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
                {isStreaming && !isUser && (
                  <span 
                    className="text-[#E0E0E0] text-lg font-normal inline-block ml-1"
                    style={{
                      animation: 'blink 1s infinite'
                    }}
                  >
                    ▊
                  </span>
                )}
              </>
            );
          })()}
        </div>
        
        {!isUser && (
          <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-[#2E3033]/50">
            <button
              onClick={handleCopyMessage}
              className="p-2 rounded-lg hover:bg-[#2E3033] transition-colors text-[#B3B3B3] hover:text-[#E0E0E0]"
              title="Copy message"
            >
              <IoCopy size={16} />
            </button>
            <button
              onClick={handleShareMessage}
              className="p-2 rounded-lg hover:bg-[#2E3033] transition-colors text-[#B3B3B3] hover:text-[#E0E0E0]"
              title="Share message"
            >
              <IoShareSocial size={16} />
            </button>
            <button
              onClick={handleReportMessage}
              className="p-2 rounded-lg hover:bg-[#2E3033] transition-colors text-[#B3B3B3] hover:text-[#E0E0E0]"
              title="Report message"
            >
              <IoFlag size={16} />
            </button>
          </div>
        )}
      </div>

      
    </div>
    </>
  )
}

export default MessageItem
