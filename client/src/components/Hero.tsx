import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          boxShadow: [
            "0 0 0 0px rgba(6, 182, 212, 0)",
            "0 0 40px 10px rgba(6, 182, 212, 0.15)",
            "0 0 0 0px rgba(6, 182, 212, 0)"
          ]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-blue-600/20 border border-primary/30 flex items-center justify-center mb-8 backdrop-blur-md relative"
      >
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        <BrainCircuit className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 mb-4 tracking-tight">
        Meet BAE
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
        Your Brainy Assistant for Everything.
        <br />
        <span className="text-primary/80 font-medium">Chat. Discover. Learn. Cook.</span>
      </p>
    </motion.div>
  );
}
