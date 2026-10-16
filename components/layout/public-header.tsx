'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHeroHeader = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/60'
            : 'bg-black/35 backdrop-blur-sm border-b border-white/10'
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="group" aria-label="MSARTIK Portraits home">
              <span className={cn('font-serif text-2xl font-medium tracking-tight', isHeroHeader && 'text-white')}>
                MSARTIK
              </span>
              <span className={cn('block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5', isHeroHeader && 'text-white/75')}>
                Portraits
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm tracking-wide link-underline transition-colors',
                    pathname === link.href
                      ? (isHeroHeader ? 'text-white' : 'text-foreground')
                      : (isHeroHeader ? 'text-white/85 hover:text-white' : 'text-muted-foreground hover:text-foreground')
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Button asChild variant="default" size="sm" className="rounded-none px-6">
                <Link href="/order">Commission a Portrait</Link>
              </Button>
            </div>

            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className={cn('h-6 w-6', isHeroHeader && 'text-white')} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background lg:hidden">
          <div className="flex items-center justify-between h-20 px-6">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <span className="font-serif text-2xl font-medium">MSARTIK</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 -mr-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-8 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-serif text-3xl py-3 border-b border-border/40 transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-8 rounded-none py-4 text-base">
              <Link href="/order">Commission a Portrait</Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
