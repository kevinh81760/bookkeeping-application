import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create OpenAI client with API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Step 2: Analyze a receipt
export async function analyzeReceipt(signedUrl, columns) {
  // Generate signed URL from the s3:// URI

  // Ask GPT to parse the receipt with your dynamic columns
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // vision-capable
    messages: [
      {
        role: "system",
        content: `You are a bookkeeping assistant. 
                  Extract the following categories: ${columns.join(", ")}. 
                  Return ONLY valid JSON, no explanations.`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Here is a receipt. Parse it into the given JSON format. Without any explanations." },
          { type: "image_url", image_url: { url: signedUrl } }
        ]
      }
    ]
  });

  const raw = response.choices[0].message.content;

  try {
    return raw;
  } catch (err) {
    console.error("Invalid JSON from GPT:", raw);
    throw new Error("GPT did not return valid JSON");
  }
}

// Step 3: Export client for custom calls
export { client };
