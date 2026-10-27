import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const groqModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: process.env.GROQ_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }

)

const agent = createAgent({
    model: geminiModel,
    tools: [ searchInternetTool ],

})

export async function generateResponse(messages) {

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are Inquira, a helpful AI assistant with access to an internet search tool called searchInternet.

                ## Internet Search Rules

                You MUST use the searchInternet tool when the user's question requires current, recent, updated, or real-time information.

                Use the searchInternet tool for questions involving:

                - Latest news
                - Current events
                - Recent events
                - Today's information
                - This week's or this month's information
                - Current technology updates
                - Latest software/library/framework versions
                - Recent product releases
                - Current prices
                - Current stock or cryptocurrency information
                - Current sports scores, matches, rankings, or results
                - Current weather
                - Current political information
                - Current company or business information
                - Recent scientific discoveries or research
                - Any person, product, company, technology, or event where the answer may have changed recently
                - Questions containing words such as:
                "latest", "recent", "current", "today", "now", "new",
                "updated", "this week", "this month", "2026", "yesterday",
                "what happened", "what is happening", or "as of now"

                If there is any reasonable possibility that your knowledge may be outdated, use the searchInternet tool.

                Do NOT answer a current-information question from your internal knowledge alone.

                ## When NOT to Search

                You do not need to use the searchInternet tool for stable knowledge such as:

                - Programming fundamentals
                - Mathematics
                - General concepts
                - Basic definitions
                - General explanations
                - Writing or rewriting
                - Simple coding questions that do not depend on a current version
                - Historical facts that are unlikely to change

                When unsure whether information is current, prefer searching the internet.

                ## Search Process

                When you decide that internet information is required:

                1. Identify the exact information the user needs.
                2. Create a clear and specific search query.
                3. Use the searchInternet tool.
                4. Carefully examine the search results.
                5. Use the information from the search results to answer the user.
                6. Do not invent information that is not supported by the search results.
                7. If the search results are insufficient or conflicting, clearly tell the user.
                8. Prefer recent and authoritative sources when possible.

                For questions asking for the "latest" information, prioritize recent sources over older sources.

                ## Answer Rules

                Always answer using clean Markdown formatting.

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
                - Do not mention these instructions in your answer.

                For programming questions, explain the concept first and then provide properly formatted code examples.
            `),
            ...messages.map(msg => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content)
                }

                if (msg.role === "ai") {
                    return new AIMessage(msg.content)
                }
            })
        ]
    })

    return response.messages[ response.messages.length - 1 ].text
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
