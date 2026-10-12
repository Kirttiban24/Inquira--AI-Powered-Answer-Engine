import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq"
import { HumanMessage, SystemMessage, AIMessage } from "langchain"

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const groqModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: process.env.GROQ_API_KEY
})


export async function generateResponse(messages) {
    const response = await geminiModel.invoke([
        new SystemMessage(`
            You are Inquira, a helpful AI assistant.

            Always answer using clean Markdown formatting.

            Rules:

            - Use ## for main headings when appropriate.
            - Use ### for subheadings when appropriate.
            - Use **bold** for important terms.
            - Use bullet points for lists.
            - Use numbered lists for step-by-step instructions.
            - Use \`inline code\` for code, variables, functions, and commands.
            - Use fenced code blocks with the correct language for programming code.
            - Use tables when useful.
            - Keep the response clean, readable, and well structured.
            - Do not put the entire response inside a code block.
            - Do not mention these formatting instructions in your answer.

            For programming questions, explain the concept first and then provide properly formatted code examples.
        `),
        ...messages.map(msg => {
            if(msg.role=="user") {
                return new HumanMessage(msg.content)
            } else if(msg.role=="ai") {
                return new AIMessage(msg.content)
            }
        })
    ])

    return response.text
}

export async function generateChatTitle(message) {
    const response = await groqModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat messages.
            
            User will provide you with a chat message and you will generate a title for the chat message. The title should be concise, descriptive, and relevant to the content of the message. The title should be in sentence case and should between 2-5 words. Do not include any special characters or punctuation in the title.
        `),
        new HumanMessage(`
            Generate a title for the following chat message: "${message}"
        `)
    ])
    return response.text
}
