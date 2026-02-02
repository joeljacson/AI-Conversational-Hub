import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Message, MessageMetadata } from "@shared/schema";
import { Sparkles, ChefHat, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Message;
  onChipClick?: (chip: string) => void;
}

export function MessageBubble({ message, onChipClick }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const metadata = message.metadata as MessageMetadata | null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex flex-col w-full max-w-3xl mb-8",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "flex items-end gap-3 max-w-[90%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
          isUser 
            ? "bg-gradient-to-br from-primary to-blue-600 text-white" 
            : "bg-white/10 text-primary border border-white/10"
        )}>
          {isUser ? (
            <div className="w-2 h-2 bg-white rounded-full" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        {/* Bubble */}
        <div className={cn(
          "px-6 py-4 rounded-3xl shadow-lg border backdrop-blur-md",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm border-primary/50" 
            : "bg-white/5 text-foreground rounded-tl-sm border-white/10"
        )}>
          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Metadata Renderers */}
      {!isUser && metadata && (
        <div className="pl-12 mt-3 space-y-3 w-full max-w-[90%]">
          
          {/* Recipe Step */}
          {metadata.recipeStep && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary/50 border border-white/5 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {metadata.recipeStep.number}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Step {metadata.recipeStep.number} of {metadata.recipeStep.total}
                </p>
                {metadata.recipeStep.title && (
                  <p className="font-semibold text-foreground">{metadata.recipeStep.title}</p>
                )}
              </div>
              <ChefHat className="w-5 h-5 text-muted-foreground opacity-50" />
            </motion.div>
          )}

          {/* Chips */}
          {metadata.chips && metadata.chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.chips.map((chip, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onChipClick?.(chip)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary 
                           border border-white/10 hover:border-primary/30 transition-all duration-200 
                           text-sm font-medium cursor-pointer active:scale-95"
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          )}

          {/* Actions */}
          {metadata.actions && metadata.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.actions.map((action, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onChipClick?.(action)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 
                           border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-xs"
                >
                  <Info className="w-3 h-3" />
                  {action}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
