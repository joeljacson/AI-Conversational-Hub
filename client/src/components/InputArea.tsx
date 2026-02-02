import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-50">
      <div className="max-w-4xl mx-auto relative px-4 md:px-0">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 p-2 rounded-[28px] glass border-white/10 bg-black/60 shadow-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:bg-black/80 focus-within:shadow-primary/10"
        >
          {/* Microphone Button (Placeholder for future voice feature) */}
          <button
            type="button"
            className="p-3 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-white/5 shrink-0"
            onClick={() => alert("Voice feature coming soon!")}
          >
            <Mic className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... try 'How do I make Biryani?'"
            className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 resize-none py-3.5 max-h-[120px] no-scrollbar text-base font-medium"
            rows={1}
            disabled={disabled}
          />

          <AnimatePresence>
            {text.trim() && (
              <motion.button
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                type="submit"
                disabled={disabled}
                className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 mb-0.5"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
        
        <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium opacity-50">
          BAE can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
