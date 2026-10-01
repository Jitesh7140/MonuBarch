'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getSiteSettings, buildWhatsAppLink } from '@/lib/settings';

export function WhatsAppButton() {
  const [number, setNumber] = useState('919876543210');

  useEffect(() => {
    getSiteSettings().then((settings) => {
      if (settings.whatsapp_number) {
        setNumber(settings.whatsapp_number);
      }
    });
  }, []);

  const link = buildWhatsAppLink(
    number,
    "Hi, I found your portrait artwork online and would like to enquire about a custom portrait."
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-6 w-6 text-white" fill="white" />
      <span className="hidden sm:block text-sm font-medium text-white pr-1">
        Chat with us
      </span>
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
    </a>
  );
}
