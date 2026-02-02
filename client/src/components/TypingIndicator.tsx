import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-4 bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-white/5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
