import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create OpenAI client with API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 2: Example helper function (test call to OpenAI)
export async function testOpenAI() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello to me" }
      ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
}

// Step 3: Export raw client in case you need custom calls
export { client };
