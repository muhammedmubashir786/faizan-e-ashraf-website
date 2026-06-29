import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle size={28} fill="white" className="text-[#25D366]" />
    </a>
  );
}
