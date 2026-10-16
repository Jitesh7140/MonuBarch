'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Maximize2, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEDIUM_LABELS } from '@/lib/pricing';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
  index?: number;
  imageOnly?: boolean;
}

export function ArtworkCard({ artwork, className, priority, index = 0, imageOnly = false }: ArtworkCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const sizes = ['h-[420px]', 'h-[520px]', 'h-[480px]', 'h-[560px]'];
  const heightClass = imageOnly ? 'h-[340px] sm:h-[360px]' : sizes[index % sizes.length];
  const medium = MEDIUM_LABELS[artwork.medium] || artwork.medium;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // Clipboard access can be blocked in older or non-secure browsers.
    }
  }

  if (imageOnly) {
    return (
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <article className={cn('group relative overflow-hidden bg-muted', className)}>
          <div className={cn('image-zoom-container relative w-full', heightClass)}>
            <Image src={artwork.image_url} alt={artwork.title} fill priority={priority} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-24 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">{medium}{artwork.size ? ` · ${artwork.size}` : ''}</p>
              <h3 className="mt-1 font-serif text-2xl font-medium text-white drop-shadow-md">{artwork.title}</h3>
              {artwork.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/95">{artwork.description}</p>}
            </div>
            <div className="absolute right-3 top-3 flex translate-y-[-6px] gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex h-10 w-10 items-center justify-center bg-black/60 text-white backdrop-blur-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white" aria-label={`View full-size ${artwork.title}`} title="View full size"><Maximize2 className="h-4 w-4" /></button>
              <button type="button" onClick={handleShare} className="inline-flex h-10 w-10 items-center justify-center bg-black/60 text-white backdrop-blur-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white" aria-label="Copy page link" title={shared ? 'Link copied' : 'Copy page link'}>{shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}</button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 bg-background px-4 py-3 sm:hidden">
            <div className="min-w-0"><p className="truncate font-serif text-lg">{artwork.title}</p><p className="truncate text-xs text-muted-foreground">{medium}{artwork.size ? ` · ${artwork.size}` : ''}</p></div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex h-9 w-9 items-center justify-center border border-border" aria-label={`View full-size ${artwork.title}`}><Maximize2 className="h-4 w-4" /></button>
              <button type="button" onClick={handleShare} className="inline-flex h-9 w-9 items-center justify-center border border-border" aria-label="Copy page link">{shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}</button>
            </div>
          </div>
        </article>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-0 bg-background p-3 sm:p-5">
          <DialogHeader className="pr-8 text-left"><DialogTitle className="font-serif text-2xl font-normal">{artwork.title}</DialogTitle><DialogDescription>{medium}{artwork.size ? ` · ${artwork.size}` : ''}{artwork.year ? ` · ${artwork.year}` : ''}</DialogDescription></DialogHeader>
          <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden bg-muted"><Image src={artwork.image_url} alt={artwork.title} fill sizes="90vw" className="object-contain" /></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-relaxed text-muted-foreground">{artwork.description || 'A handcrafted portrait from the MSARTIK collection.'}</p><button type="button" onClick={handleShare} className="inline-flex shrink-0 items-center justify-center gap-2 border border-border px-4 py-2 text-sm transition hover:bg-accent">{shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{shared ? 'Link copied' : 'Copy page link'}</button></div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Link href={`/portfolio/${artwork.id}`} className={cn('group block', className)}>
      <div className={cn('image-zoom-container relative w-full', heightClass)}>
        <Image src={artwork.image_url} alt={artwork.title} fill priority={priority} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100"><p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/70">{medium}</p><h3 className="font-serif text-2xl text-white">{artwork.title}</h3></div>
      </div>
      <div className="mt-4 flex items-baseline justify-between"><div><h3 className="font-serif text-xl">{artwork.title}</h3><p className="mt-1 text-sm text-muted-foreground">{medium}{artwork.size ? ` · ${artwork.size}` : ''}</p></div>{artwork.price !== null && <p className="whitespace-nowrap text-sm text-muted-foreground">From ₹{artwork.price.toLocaleString('en-IN')}</p>}</div>
    </Link>
  );
}
