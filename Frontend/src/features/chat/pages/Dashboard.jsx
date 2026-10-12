import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'
import ReactMarkdown from 'react-markdown'

const Dashboard = () => {

  const chat = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  // Get chat data from Redux
  const chats = useSelector(state => state.chat.chats)
  const currentChatId = useSelector(state => state.chat.currentChatId)

  // Find the currently selected chat
  const currentChat = Object.values(chats).find(
    chatItem => chatItem._id === currentChatId
  )

  // Get messages from current chat
  const messages = currentChat?.messages || []

  // Initialize Socket.IO
  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])


  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  // Send message
  const handleSend = async () => {

    const trimmed = input.trim()

    if (!trimmed) {
      return
    }

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

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectChat = async (chatId) => {
    try {
        await chat.handleGetMessages(chatId)
    } catch (error) {
        console.error("Failed to load chat messages:", error)
    }
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 transition-colors"
          >
            🔍 Search
          </button>


          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 transition-colors"
          >
            + New Chat
          </button>

        </div>


        {/* Chat List */}

        <nav className="flex-1 overflow-y-auto px-4 py-4">

          {Object.values(chats).length === 0 ? (

            <p className="text-xs text-zinc-500 px-1">
              No chats yet
            </p>

          ) : (

            <ul className="space-y-1">

              {Object.values(chats).map(chatItem => (

                <li key={chatItem._id}>

                <button
                  onClick={() => handleSelectChat(chatItem._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentChatId === chatItem._id
                          ? 'bg-white/10 text-white'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {chatItem.title}
                </button>

                </li>

              ))}

            </ul>

          )}

        </nav>


        {/* Footer */}

        <div className="px-4 py-4 border-t border-white/10 space-y-1">

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            👤 Profile
          </button>


          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors w-full"
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

        <header className="h-14 px-6 flex items-center justify-between border-b border-white/10 shrink-0">

          <h1 className="text-sm font-medium text-zinc-200 truncate">

            {currentChat?.title || "New Chat"}

          </h1>


          <button
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-lg leading-none"
          >
            ···
          </button>

        </header>


        {/* =================================================
            MESSAGES
        ================================================== */}

        <section className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

          {messages.length === 0 ? (

            <div className="h-full flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-xl font-medium text-zinc-300">

                  What can I help you with?

                </h2>


                <p className="text-sm text-zinc-500 mt-2">

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

                  <div className="max-w-xs bg-violet-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm shadow">
                    
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

                 <div className="max-w-2xl bg-zinc-800 text-zinc-100 text-sm px-5 py-3.5 rounded-2xl rounded-tl-sm shadow leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mt-4 mb-3">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mt-4 mb-2">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold mt-3 mb-2">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">
                            {children}
                          </p>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc ml-5 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal ml-5 mb-3 space-y-1">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li>{children}</li>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),

                        em: ({ children }) => (
                          <em>{children}</em>
                        ),

                        code: ({ children }) => (
                          <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-violet-300 text-xs">
                            {children}
                          </code>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-violet-500 pl-4 my-3 text-zinc-400">
                            {children}
                          </blockquote>
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
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 resize-none outline-none leading-5"
            />


            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >

              <svg
                className="w-4 h-4 text-white"
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