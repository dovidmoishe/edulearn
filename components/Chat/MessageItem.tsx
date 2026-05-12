"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { IoCopy, IoShareSocial, IoFlag } from "react-icons/io5";
import { Message } from "../../services/ai.service";
import useUserStore from "../../core/userState";
import useAgentStore from "../../core/agentStore";
import logo from "@/../public/assets/images/edulearn.png";
import ChatRoadmapCard from "./ChatRoadmapCard";
import ChatFlashcardDeck from "./ChatFlashcardDeck";
import ChatPublicQuizCard from "./ChatPublicQuizCard";

const EMBED_SPLIT =
  /(\[ROADMAP_CARD:[a-f0-9-]+\]|\[FLASHCARD_CARD:[a-f0-9-]+\]|\[PUBLIC_QUIZ_CARD:[a-f0-9-]+\])/i;

function parseEmbed(
  part: string,
):
  | { kind: "roadmap"; id: string }
  | { kind: "flashcard"; id: string }
  | { kind: "quiz"; id: string }
  | null {
  const t = part.trim();
  let m = t.match(/^\[ROADMAP_CARD:([a-f0-9-]+)\]$/i);
  if (m) return { kind: "roadmap", id: m[1] };
  m = t.match(/^\[FLASHCARD_CARD:([a-f0-9-]+)\]$/i);
  if (m) return { kind: "flashcard", id: m[1] };
  m = t.match(/^\[PUBLIC_QUIZ_CARD:([a-f0-9-]+)\]$/i);
  if (m) return { kind: "quiz", id: m[1] };
  return null;
}

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

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[#E0E0E0] mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-[#E0E0E0] text-lg font-bold mb-3">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-[#E0E0E0] text-base font-bold mb-2">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-[#E0E0E0] text-sm font-bold mb-2">{children}</h3>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-[#E0E0E0] font-bold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-[#E0E0E0] italic">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-[#E0E0E0] list-disc list-inside mb-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-[#E0E0E0] list-decimal list-inside mb-2 space-y-1">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[#E0E0E0]">{children}</li>
  ),
  code: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-[#2E3033] text-[#00FF80] px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-[#2E3033] text-[#E0E0E0] p-3 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-[#2E3033] text-[#E0E0E0] p-3 rounded-lg text-sm overflow-x-auto mb-2 font-mono">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-[#00FF80] pl-4 text-[#E0E0E0] italic mb-2 bg-[#1A1A1A]/50 py-2 rounded-r">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      className="text-[#00FF80] hover:text-[#00E070] underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full border border-[#2E3033] rounded-lg">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border border-[#2E3033] px-3 py-2 bg-[#1A1A1A] text-[#E0E0E0] font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border border-[#2E3033] px-3 py-2 text-[#E0E0E0]">{children}</td>
  ),
};

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

function flattenMessageContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item: unknown) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in (item as object)) {
          return String((item as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  if (content && typeof content === "object" && "text" in (content as object)) {
    return String((content as { text: string }).text);
  }
  return "";
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isStreaming = false,
}) => {
  const { agent } = useAgentStore();
  const isUser = message.role === "user";

  const getMessageContent = () => flattenMessageContent(message.content);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(getMessageContent());
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleShareMessage = async () => {
    try {
      const messageText = getMessageContent();
      if (navigator.share) {
        await navigator.share({
          title: "AI Response",
          text: messageText,
        });
      } else {
        await navigator.clipboard.writeText(messageText);
      }
    } catch (error) {
      console.error("Failed to share message:", error);
    }
  };

  const handleReportMessage = async () => {
    try {
      const messageText = getMessageContent();
      const subject = encodeURIComponent("Report AI Response");
      const body = encodeURIComponent(
        `I would like to report the following AI response:\n\n"${messageText}"\n\nReason for report:\n\n`,
      );
      window.open(`mailto:support@edulearn.com?subject=${subject}&body=${body}`, "_blank");
    } catch (error) {
      console.error("Failed to open email client:", error);
    }
  };

  const renderMarkdownChunk = (chunk: string, key: string) => (
    <ReactMarkdown key={key} components={markdownComponents}>
      {chunk}
    </ReactMarkdown>
  );

  const renderContentWithEmbeds = (content: string) => {
    const parts = content.split(EMBED_SPLIT);
    const hasEmbeds = parts.some((p) => parseEmbed(p) !== null);
    if (!hasEmbeds) {
      return renderMarkdownChunk(content, "full");
    }
    return (
      <>
        {parts.map((part, i) => {
          if (!part) return null;
          const embed = parseEmbed(part);
          if (embed?.kind === "roadmap") {
            return <ChatRoadmapCard key={`e-${i}`} roadmapId={embed.id} />;
          }
          if (embed?.kind === "flashcard") {
            return <ChatFlashcardDeck key={`e-${i}`} deckId={embed.id} />;
          }
          if (embed?.kind === "quiz") {
            return <ChatPublicQuizCard key={`e-${i}`} quizId={embed.id} />;
          }
          if (part.trim().length === 0) return null;
          return renderMarkdownChunk(part, `e-${i}`);
        })}
      </>
    );
  };

  const renderBody = () => {
    const content = getMessageContent();

    if (!content || content.trim().length === 0) {
      if (isStreaming && !isUser) {
        return (
          <span
            className="text-[#E0E0E0] text-lg font-normal inline-block"
            style={{ animation: "blink 1s infinite" }}
          >
            ▊
          </span>
        );
      }
      return <span className="text-[#E0E0E0] opacity-50">...</span>;
    }

    try {
      const body = renderContentWithEmbeds(content);
      if (isStreaming && !isUser) {
        return (
          <span className="inline-flex flex-wrap items-end gap-1">
            <span className="min-w-0 flex-1">{body}</span>
            <span
              className="text-[#E0E0E0] text-lg font-normal shrink-0"
              style={{ animation: "blink 1s infinite" }}
            >
              ▊
            </span>
          </span>
        );
      }
      return body;
    } catch {
      return (
        <span className="text-[#E0E0E0]">
          {content}
          {isStreaming && !isUser ? " ▊" : ""}
        </span>
      );
    }
  };

  return (
    <>
      <style jsx>{cursorStyles}</style>
      <div
        className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <div className="mt-1 shrink-0">
            {agent?.profile_picture_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agent.profile_picture_url}
                alt=""
                className="h-[27px] w-[27px] rounded-full object-cover"
              />
            ) : (
              <Image src={logo} alt="AI" width={27} height={27} />
            )}
          </div>
        )}

        <div
          className={`max-w-[75%] rounded-lg p-4 ${
            isUser
              ? "bg-[#0D0D0D] border border-[#2E3033] rounded-tr-sm"
              : "bg-[#1A1A1A] rounded-tl-sm"
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none">{renderBody()}</div>

          {!isUser && !isStreaming && (
            <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-[#2E3033]/50">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="p-2 rounded-lg hover:bg-[#2E3033] transition-colors text-[#B3B3B3] hover:text-[#E0E0E0]"
                title="Copy message"
              >
                <IoCopy size={16} />
              </button>
              <button
                type="button"
                onClick={handleShareMessage}
                className="p-2 rounded-lg hover:bg-[#2E3033] transition-colors text-[#B3B3B3] hover:text-[#E0E0E0]"
                title="Share message"
              >
                <IoShareSocial size={16} />
              </button>
              <button
                type="button"
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
  );
};

export default MessageItem;
