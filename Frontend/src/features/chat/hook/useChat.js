import { initializeSocketConnection } from "../service/chat.socket"
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api"
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, setChatMessages } from "../chat.slice"
import { useDispatch } from "react-redux"

export const useChat = () => {
    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage( message, chatId )
        const { chat, aiMessage } = data
        dispatch(createNewChat({ 
            chatId: chat._id, 
            title: chat.title 
        }))
        dispatch(addNewMessage({ 
            chatId: chat._id, 
            content: message, 
            role: "user" 
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                _id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.lastUpdated
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleGetMessages(chatId) {
        dispatch(setLoading(true))

        const data = await getMessages(chatId)

        dispatch(setChatMessages({
            chatId,
            messages: data.messages
        }))

        dispatch(setCurrentChatId(chatId))

        dispatch(setLoading(false))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages
    }
}
