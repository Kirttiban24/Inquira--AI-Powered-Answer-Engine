import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";

const Dashboard = () => {

  const chat = useChat()

  const [input, setInput] = useState('')
  const [openMenuChatId, setOpenMenuChatId] = useState(null)

  const bottomRef = useRef(null)

  const chats = useSelector(state => state.chat.chats)
  const currentChatId = useSelector(state => state.chat.currentChatId)

  const currentChat = Object.values(chats).find(
    chatItem => chatItem._id === currentChatId
  )

  const messages = currentChat?.messages || []

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuChatId(null)
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    try {
      await chat.handleSendMessage({
        message: trimmed,
        chatId: currentChatId
      })

      setInput('')
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleSelectChat = async (chatId) => {
    try {
      await chat.handleGetMessages(chatId)
    } catch (error) {
      console.error("Failed to load chat messages:", error)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      await chat.handleDeleteChat(chatId)
      setOpenMenuChatId(null)
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatChatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex overflow-hidden">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col shrink-0">

        {/* Brand */}

        <div className="px-5 py-5 border-b border-white/10">

          <span className="text-lg font-semibold tracking-wide flex items-center gap-2">

            <span className="text-violet-400">
              ✦
            </span>

            INQUIRA

          </span>

        </div>


        {/* Actions */}

        <div className="px-4 py-4 flex flex-col gap-2 border-b border-white/10">

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors"
          >
            🔍 Search
          </button>


          <button
            onClick={chat.handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors"
          >
            + New Chat
          </button>

        </div>


        {/* Chat List */}

        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-chatgpt">

          {Object.values(chats).length === 0 ? (

            <p className="text-sm text-zinc-500 px-1">
              No chats yet
            </p>

          ) : (

            <ul className="space-y-1">

              {Object.values(chats).map(chatItem => (

                <li
                  key={chatItem._id}
                  className="relative group"
                >

                  {/* Chat button */}
                  <button
                    onClick={() => handleSelectChat(chatItem._id)}
                    className={`w-full text-left px-3 py-2 pr-10 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chatItem._id
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >

                    <div className="truncate text-sm font-medium">
                      {chatItem.title}
                    </div>

                    <div className="text-xs text-zinc-500 mt-1">
                      {formatChatDate(chatItem.createdAt)}
                    </div>

                  </button>


                  {/* Three dot button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()

                      setOpenMenuChatId(
                        openMenuChatId === chatItem._id
                          ? null
                          : chatItem._id
                      )
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                              opacity-0 group-hover:opacity-100
                              text-zinc-400 hover:text-white
                              px-1 cursor-pointer transition-opacity"
                  >
                    ⋯
                  </button>


                  {/* Three dot menu */}
                  {openMenuChatId === chatItem._id && (
                    <div
                      className="absolute right-2 top-10 z-50
                                w-32 bg-zinc-800
                                border border-white/10
                                rounded-lg shadow-xl
                                cursor-pointer py-1"
                    >

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChat(chatItem._id)
                        }}
                        className="w-full text-left px-3 py-2
                                  text-sm text-red-400
                                  hover:bg-white/5
                                  transition-colors"
                      >
                        Delete chat
                      </button>

                    </div>
                  )}

                </li>

              ))}
            </ul>

          )}

        </nav>


        {/* Footer */}

        <div className="px-4 py-4 border-t border-white/10 space-y-1">

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors w-full"
          >
            👤 Profile
          </button>


          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base text-zinc-400 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            ⚙ Settings
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="flex-1 flex flex-col min-w-0">


        {/* =================================================
            CHAT HEADER
        ================================================== */}

        <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 shrink-0">

          <h1 className="text-lg font-semibold text-zinc-100 truncate">
            {currentChat?.title || "New Chat"}
          </h1>


          <button
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xl leading-none"
          >
            ···
          </button>

        </header>


        {/* =================================================
            MESSAGES
        ================================================== */}

        <section className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-chatgpt">

          {messages.length === 0 ? (

            <div className="h-full flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-2xl font-semibold text-zinc-300">
                  What can I help you with?
                </h2>

                <p className="text-base text-zinc-500 mt-2">
                  Ask anything to get started.
                </p>

              </div>

            </div>

          ) : (

            messages.map((msg, index) => (

              msg.role === 'user' ? (

                /* ==============================
                   USER MESSAGE
                =============================== */

                <div
                  key={msg._id || index}
                  className="flex justify-end"
                >

                  <div className="max-w-lg bg-violet-600/80 text-white text-base font-medium px-5 py-3 rounded-2xl rounded-tr-sm shadow">

                    {msg.content}

                  </div>

                </div>

              ) : (

                /* ==============================
                   AI MESSAGE
                =============================== */

                <div
                  key={msg._id || index}
                  className="flex justify-start"
                >

                  <div className="w-full text-zinc-100 text-base px-2 py-4 leading-7">

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                          h1: ({ children }) => (
                              <h1 className="text-2xl font-bold mt-5 mb-3">
                                  {children}
                              </h1>
                          ),

                          h2: ({ children }) => (
                              <h2 className="text-xl font-semibold mt-5 mb-3">
                                  {children}
                              </h2>
                          ),

                          h3: ({ children }) => (
                              <h3 className="text-lg font-semibold mt-4 mb-2">
                                  {children}
                              </h3>
                          ),

                          p: ({ children }) => (
                              <p className="mb-4">
                                  {children}
                              </p>
                          ),

                          ul: ({ children }) => (
                              <ul className="list-disc ml-6 mb-4 space-y-2">
                                  {children}
                              </ul>
                          ),

                          ol: ({ children }) => (
                              <ol className="list-decimal ml-6 mb-4 space-y-2">
                                  {children}
                              </ol>
                          ),

                          li: ({ children }) => (
                              <li>
                                  {children}
                              </li>
                          ),

                          strong: ({ children }) => (
                              <strong className="font-semibold text-white">
                                  {children}
                              </strong>
                          ),

                          em: ({ children }) => (
                              <em>
                                  {children}
                              </em>
                          ),

                          // Inline code
                          code: ({ children, className, ...props }) => {
                              const isBlock = className?.includes("language-");

                              return isBlock ? (
                                  <code
                                      className="block text-sm text-zinc-200"
                                      {...props}
                                  >
                                      {children}
                                  </code>
                              ) : (
                                  <code
                                      className="bg-zinc-700 px-1.5 py-0.5 rounded text-violet-300 text-sm"
                                      {...props}
                                  >
                                      {children}
                                  </code>
                              );
                          },

                          // Multiline code container
                          pre: ({ children }) => (
                              <pre className="my-4 w-full overflow-x-auto bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm leading-6">
                                  {children}
                              </pre>
                          ),

                          blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-violet-500 pl-4 my-4 text-zinc-400">
                                  {children}
                              </blockquote>
                          ),

                          // Tables
                          table: ({ children }) => (
                              <div className="w-full overflow-x-auto my-5">
                                  <table className="w-full border-collapse text-sm">
                                      {children}
                                  </table>
                              </div>
                          ),

                          thead: ({ children }) => (
                              <thead className="border-b border-white/20">
                                  {children}
                              </thead>
                          ),

                          tbody: ({ children }) => (
                              <tbody className="divide-y divide-white/10">
                                  {children}
                              </tbody>
                          ),

                          tr: ({ children }) => (
                              <tr className="hover:bg-white/5 transition-colors">
                                  {children}
                              </tr>
                          ),

                          th: ({ children }) => (
                              <th className="text-left px-4 py-3 font-semibold text-zinc-200 whitespace-nowrap">
                                  {children}
                              </th>
                          ),

                          td: ({ children }) => (
                              <td className="px-4 py-3 text-zinc-300">
                                  {children}
                              </td>
                          ),

                          // Links
                          a: ({ children, href }) => (
                              <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-violet-400 hover:text-violet-300 underline cursor-pointer"
                              >
                                  {children}
                              </a>
                          ),
                        }}
                      >
                      {msg.content}

                    </ReactMarkdown>

                  </div>

                </div>

              )

            ))

          )}


          {/* Scroll reference */}

          <div ref={bottomRef} />

        </section>


        {/* =================================================
            MESSAGE COMPOSER
        ================================================== */}

        <footer className="px-6 py-4 border-t border-white/10 shrink-0">

          <div className="flex items-center gap-3 bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 focus-within:border-violet-500/60 transition-colors">

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-base text-zinc-200 placeholder-zinc-500 resize-none outline-none leading-6"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 p-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >

              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />

              </svg>

            </button>

          </div>


          <p className="text-xs text-zinc-600 text-center mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>

        </footer>

      </main>

    </div>
  )
}

export default Dashboard 
