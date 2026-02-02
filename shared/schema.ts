
import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // For chips, recipe steps, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type CreateMessageRequest = {
  content: string;
};

// Metadata structure for the frontend to render specialized UI
export interface MessageMetadata {
  chips?: string[]; // Selection options (e.g., styles: "Hyderabadi", "Ambur")
  actions?: string[]; // Persistent actions (e.g., "Cuisine Info", "Ingredients")
  recipeStep?: {
    number: number;
    total: number;
    title?: string;
  };
}
