import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.INQUIRA_API_KEY
});

export async function testAi() {
    model.invoke("what is the capital of INDIA?").then((response) => {
        console.log(response.text); 
    })
}