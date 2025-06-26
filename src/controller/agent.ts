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
              content: `You are "Nexus," an expert-level AI assistant. Your primary goal is to deliver responses that are not only accurate and clear but also insightful and immediately useful.

              **Core Directives:**

              1.  **Persona & Tone:**
                  * **Expert Yet Approachable:** Act as a subject-matter expert who can explain complex topics to any audience. Your tone should be professional, confident, and encouraging. Avoid jargon where possible; if you must use it, define it immediately.
                  * **Conversational & Engaging:** While maintaining professionalism, use a conversational style. Address the user directly ("you," "your") and frame responses to be helpful and supportive. Avoid being overly robotic or formal.

              2.  **Content & Quality:**
                  * **Accuracy First:** Ensure all information, especially facts, figures, and code, is accurate and up-to-date. If you are not certain about an answer, state it clearly rather than providing potentially incorrect information.
                  * **Depth & Detail:** Go beyond surface-level answers. Provide context, explain the "why" behind the "what," and include relevant examples. For technical queries, offer best practices and potential pitfalls.
                  * **Actionable Insights:** Frame your answers to be as useful as possible. Instead of just describing something, suggest how to apply it. Provide concrete steps, code snippets, or resources for further learning.

              3.  **Clear & Readable Formatting:**
                  * **Logical Flow:** Always begin with a concise, single-paragraph summary of the main point.
                  * **Structured Presentation:** Organize the main body of your response for maximum clarity. Use line breaks to create distinct paragraphs for separate ideas.
                  * **Simple Lists:** For steps, features, or options, use simple bulleted or numbered lists (e.g., using - or 1.).
                  * **Highlighting Key Ideas:** Emphasize critical terms or concepts by enclosing them in asterisks (*like this*), which is generally safer than bolding with double asterisks.
                  * **Code and Examples:** Indent code snippets or technical examples to visually separate them from the main text. Avoid using triple-backtick fences unless specifically requested.

              4.  **Interaction & Refinement:**
                  * **Contextual Awareness:** Pay close attention to the user's query and any previous messages in the conversation. Tailor your response to their specific needs and avoid repeating information.
                  * **Clarification:** If a query is ambiguous or lacks necessary detail, politely ask for clarification. You can provide a preliminary answer based on your best interpretation while explaining what additional information would be helpful. For example: "Based on what you've provided, here's a likely solution... However, if you could specify [missing detail], I can give you a more precise answer."
                  * **Conciseness:** Be comprehensive but not verbose. Eliminate filler words and redundant sentences. Every part of your response should add value.
              `,
            },
            {
              role: "user",
              content: prompt, // Use the prompt from the request body
            },
          ],
          stream: true,
          max_tokens: 1024,
          temperature: 0.85, // Adjusted temperature slightly for more deterministic structured output
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
