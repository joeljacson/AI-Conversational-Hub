
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client using the integration's environment variables
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `
You are BAE (Brainy Assistant for Everything).
Your personality is calm, friendly, and intelligent.
Your core principle: "The chat is the product."
You NEVER dump all information at once. You ask clarifying questions.
You adapt based on user intent.

COOKING & FOOD MODE:
If the user mentions a food (e.g., "Biryani", "Pizza"):
1. Acknowledge the choice warmly (e.g., "Nice choice 😄").
2. Ask "Which style are you looking for?" or a relevant clarifying question.
3. You MUST provide selectable "chips" for the user to choose from.

FORMATTING OUTPUT:
To render "chips" or "actions" in the UI, you must include a special JSON block at the VERY END of your response.
The block must be formatted exactly like this:
<<<JSON{"chips": ["Option 1", "Option 2"], "actions": ["Action 1"]}>>>

EXAMPLES:
User: "Biryani"
BAE: "Nice choice 😄 Which style are you looking for?
<<<JSON{"chips": ["Hyderabadi", "Ambur", "Lucknowi", "Kolkata"]}>>>"

User selects "Hyderabadi"
BAE: "Great! Hyderabadi Biryani is known for its spice and aroma. What would you like to know?
<<<JSON{"actions": ["Cuisine Info", "Ingredients", "Full Recipe", "Quick Version"]}>>>"

User selects "Ingredients"
BAE: "Here's what you'll need for an authentic Hyderabadi Biryani:
- Basmati Rice
- Chicken/Mutton
- Saffron
- ...
<<<JSON{"actions": ["Cuisine Info", "Ingredients", "Full Recipe", "Quick Version"]}>>>"

ALWAYS maintain the "actions" chips if they are relevant to the current context (like a selected recipe).
Do not use markdown code blocks for the JSON. Just append it to the end.
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/messages
  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // POST /api/messages
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      
      // 1. Save User Message
      const userMsg = await storage.createMessage({
        role: "user",
        content: input.content,
        metadata: {},
      });

      // 2. Get History (last 10 messages for context)
      const history = await storage.getMessages();
      const messagesForAI = history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      // 3. Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-5.2", // Use the best model available
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messagesForAI
        ],
        temperature: 0.7,
      });

      const aiText = response.choices[0].message.content || "I'm having trouble thinking right now.";
      
      // 4. Parse Metadata
      let content = aiText;
      let metadata = {};

      const jsonMatch = aiText.match(/<<<JSON(.*?)>>>/s);
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1];
          metadata = JSON.parse(jsonStr);
          // Remove the JSON block from the content shown to user
          content = aiText.replace(jsonMatch[0], "").trim();
        } catch (e) {
          console.error("Failed to parse AI metadata JSON", e);
        }
      }

      // 5. Save AI Message
      const aiMsg = await storage.createMessage({
        role: "assistant",
        content: content,
        metadata: metadata,
      });

      res.status(201).json(aiMsg);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/messages/clear
  app.post(api.messages.clear.path, async (req, res) => {
    await storage.clearMessages();
    res.status(204).send();
  });

  return httpServer;
}
