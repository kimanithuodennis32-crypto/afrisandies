import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WhatsAppFab({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hi AFRI SANDIES! I want to place an order."
  )}`;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button asChild className="rounded-full shadow-lg shadow-black/30">
        <a href={href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
        </a>
      </Button>
    </motion.div>
  );
}
