import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title, createdAt } = action.payload;
            state.chats[chatId] = {
                _id: chatId,
                title,
                messages: [],
                createdAt,
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload

            if (!state.chats[chatId]) {
                return
            }
            state.chats[chatId].messages.push({ content, role })
        },
        setChatMessages: (state, action) => {
            const { chatId, messages } = action.payload

            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, setChatMessages } = chatSlice.actions;
export default chatSlice.reducer;