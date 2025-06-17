import { Router, Request, Response, NextFunction } from "express";
import axios from "axios"; // npm install axios
import { body, validationResult } from "express-validator";
import { returnResponse } from "../interface";

const router = Router();

router.post(
  "/llm-stream",
  [body("prompt").isString().withMessage("Prompt is required")],
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        meta: { statuscode: 400, message: "Validation error" },
        data: { info: errors.array() },
      });
    }

    const { prompt } = req.body;

    try {
      // Example: Replace with Chutes AI streaming endpoint and headers
      const llmResponse = await axios.post(
        "https://llm.chutes.ai/v1/chat/completions",
        {
          model: "deepseek-ai/DeepSeek-V3-0324",
          messages: [
            {
              role: "system",
              content: `
                You are an expert assistant designed to provide highly accurate, clear, and engaging responses. Follow these guidelines to enhance the output:
                - **Tone**: Maintain a professional yet approachable tone, ensuring responses are concise and easy to understand.
                - **Structure**: Organize responses using markdown formatting. Use headings, bullet points, or numbered lists for clarity. If applicable, include code snippets in properly formatted code blocks (e.g., \`\`\`javascript).
                - **Content Quality**: Provide detailed and accurate answers, avoiding vague or generic responses. Include examples, explanations, or references where relevant to support the answer.
                - **Context Awareness**: Tailor responses to the user's query, incorporating any relevant context provided. Avoid unnecessary repetition or off-topic information.
                - **Error Handling**: If the query is ambiguous, politely ask for clarification while providing a best-effort response based on available information.
                - **Engagement**: Use a conversational style to make the response engaging, but avoid overly casual slang unless requested.
                - **Output Length**: Aim for comprehensive yet concise responses, prioritizing key information and avoiding filler content.
                - **Formatting**: For technical queries, include code, tables, or other structured formats to enhance readability.
                `,
            },
            {
              role: "user",
              content: prompt, // Use the prompt from the request body
            },
          ],
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CHUTES_API_KEY}`,
          },
          responseType: "stream",
        }
      );

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      llmResponse.data.on("data", (chunk: Buffer) => {
        res.write(chunk);
      });

      llmResponse.data.on("end", () => {
        res.end();
      });

      llmResponse.data.on("error", (err: Error) => {
        res.write(`\n[ERROR]: ${err.message}`);
        res.end();
      });
    } catch (error: any) {
      res.status(500).json({
        meta: { statuscode: 500, message: "Server error" },
        data: { info: error.message },
      });
    }
  }
);

export default router;
