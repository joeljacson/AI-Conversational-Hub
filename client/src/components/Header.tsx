import { motion } from "framer-motion";
import { BrainCircuit, Trash2 } from "lucide-react";
import { useClearMessages } from "@/hooks/use-messages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Header() {
  const { mutate: clearMessages } = useClearMessages();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 h-16"
    >
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">BAE</span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Clear conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all messages and reset BAE to its initial state.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clearMessages()} className="bg-destructive text-white hover:bg-destructive/90">
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.header>
  );
}
