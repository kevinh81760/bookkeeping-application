import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// create OpenAI client with API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// helper function (example: test call)
export async function testOpenAI() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Write me a gay bed time story about sri and sammy, they are best friends and they are going to sleep together." }
      ],
    });

    console.log(response.choices[0].message.content);

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    throw error;
  }
}

// export raw client in case you need custom calls
export { client };
