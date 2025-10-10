import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create OpenAI client with API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 2: Analyze a receipt
export async function analyzeReceipt(signedUrl, columnNames = [], categories = []) {
  // 🧾 Optimized bookkeeping system prompt
  const systemPrompt = `
    You are a bookkeeping assistant that extracts structured data from receipts.

    Your task:
    Analyze the uploaded receipt image and output data as a JSON array of objects, following the user’s custom configuration.

    Configuration:
    - Column names: ${JSON.stringify(columnNames)}
    - Categories (optional): ${JSON.stringify(categories)}

    Guidelines:
    1. Return ONLY valid JSON. No explanations, markdown, or text outside the JSON.
    2. Use EXACTLY the column names provided in ${JSON.stringify(columnNames)} as keys.
    3. If ${JSON.stringify(categories)} is empty or not defined, omit the "category" field.
    4. If a column name does not appear in the receipt, set its value to null.
    5. When categories are defined:
       - Classify each item into the most fitting one.
       - If unsure, pick the closest match rather than leaving it null.
       - Use context clues (e.g., "chicken" → meat, "salad" → vegetables, "soda" → drinks, "cake" → snacks).
    6. Numeric values should remain numeric (e.g., 12.50 not "12.50").
    7. Always output a JSON array (even if there is only one item).
    8. Do NOT include markdown fences like \`\`\`json or extra commentary.
    9. Preserve item details as written on the receipt; do not paraphrase.

    Your response must be a clean JSON array that matches the user’s defined structure exactly.
  `;

  // Ask GPT to parse the receipt
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // vision-capable
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here is a receipt. Parse it into the given JSON format. Without any explanations.",
          },
          {
            type: "image_url",
            image_url: { url: signedUrl },
          },
        ],
      },
    ],
  });

  const raw = response.choices?.[0]?.message?.content?.trim();

  console.log("Raw GPT output:\n", raw);

  try {
    // Remove markdown fences like ```json or ```
    const cleaned = raw
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Invalid JSON from GPT:", raw);
    throw new Error("GPT did not return valid JSON");
  }
}

// Step 3: Export client for custom calls
export { client };
