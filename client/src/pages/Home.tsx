import { useRef, useEffect } from "react";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { InputArea } from "@/components/InputArea";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { data: messages = [], isLoading } = useMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isSending]);

  const handleSend = (content: string) => {
    sendMessage({ content });
  };

  const hasMessages = messages.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <AnimatePresence>
        {hasMessages && <Header />}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 pb-64">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <Hero key="hero" />
          ) : (
            <motion.div 
              key="chat-list"
              className="flex flex-col pt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  onChipClick={handleSend}
                />
              ))}
              
              {/* Fake Typing Indicator if pending but no new message yet (or logic based on status) */}
              {isSending && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-3"
                 >
                   <div className="w-8 h-8 rounded-full bg-white/10 text-primary border border-white/10 flex items-center justify-center">
                     <div className="w-4 h-4 rounded-full bg-primary/50 animate-pulse" />
                   </div>
                   <TypingIndicator />
                 </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <InputArea onSend={handleSend} disabled={isSending} />
    </div>
  );
}
