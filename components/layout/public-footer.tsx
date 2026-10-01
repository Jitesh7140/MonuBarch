'use client';

import Link from 'next/link';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/settings';

export function PublicFooter() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <h3 className="font-serif text-3xl font-medium">
              {settings.artist_name || 'Aarav Mehta'}
            </h3>
            <p className="text-sm text-primary-foreground/60 mt-1 uppercase tracking-[0.2em]">
              Portraits
            </p>
            <p className="mt-6 text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
              {settings.description ||
                'Detailed, handcrafted portraits created from your most meaningful photographs.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link href="/portfolio" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Portfolio</Link></li>
              <li><Link href="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">About</Link></li>
              <li><Link href="/testimonials" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-6">
              Commission
            </h4>
            <ul className="space-y-3">
              <li><Link href="/order" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Order a Portrait</Link></li>
              <li><Link href="/pricing" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-6">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={settings.instagram_url || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  {settings.instagram_handle || '@aaravportraits'}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email || 'hello@aaravmehtaportraits.com'}`} className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  {settings.email || 'hello@aaravmehtaportraits.com'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                {settings.phone || '+91 98765 43210'}
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                {settings.studio_location || 'Mumbai, India'}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/15">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/50">
              &copy; {new Date().getFullYear()} {settings.brand_name || 'Aarav Mehta Portraits'}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy-policy" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">Terms &amp; Conditions</Link>
              <Link href="/shipping-policy" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">Shipping Policy</Link>
              <Link href="/refund-policy" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">Refund &amp; Cancellation</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
