'use client';

import { supabase } from '@/lib/supabase-client';
import type { SiteSetting } from '@/types';

let settingsCache: Record<string, string> | null = null;

export async function getSiteSettings(): Promise<Record<string, string>> {
  if (settingsCache) return settingsCache;

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error || !data) {
    return getDefaultSettings();
  }

  const map: Record<string, string> = {};
  for (const item of data as SiteSetting[]) {
    map[item.key] = item.value;
  }
  settingsCache = { ...getDefaultSettings(), ...map };
  return settingsCache;
}

export function getDefaultSettings(): Record<string, string> {
  return {
    artist_name: 'Aarav Mehta',
    brand_name: 'Aarav Mehta Portraits',
    tagline: 'Turning Memories Into Art',
    subtitle: 'Handcrafted Pencil & Charcoal Portraits',
    description:
      'Detailed, handcrafted portraits created from your most meaningful photographs.',
    whatsapp_number: '919876543210',
    instagram_url: 'https://instagram.com',
    instagram_handle: '@aaravportraits',
    email: 'hello@aaravmehtaportraits.com',
    phone: '+91 98765 43210',
    studio_location: 'Mumbai, India',
    about_intro:
      'I am a self-taught portrait artist based in Mumbai, specialising in pencil and charcoal drawings. Every portrait I create is a quiet conversation between the subject and the medium.',
    about_style:
      'My work focuses on capturing not just likeness, but presence. I work primarily in pencil for its delicate tonal range and in charcoal for its dramatic depth.',
    about_inspiration:
      'I am inspired by the quiet dignity of ordinary faces and the stories that photographs carry.',
  };
}

export function getSetting(
  settings: Record<string, string>,
  key: string
): string {
  return settings[key] || getDefaultSettings()[key] || '';
}

export function buildWhatsAppLink(number: string, message: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
