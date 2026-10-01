'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, MEDIUM_LABELS } from '@/lib/pricing';
import type { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
  index?: number;
}

export function ArtworkCard({ artwork, className, priority, index = 0 }: ArtworkCardProps) {
  const sizes = ['h-[420px]', 'h-[520px]', 'h-[480px]', 'h-[560px]'];
  const heightClass = sizes[index % sizes.length];

  return (
    <Link
      href={`/portfolio/${artwork.id}`}
      className={cn('group block', className)}
    >
      <div className={cn('image-zoom-container relative w-full', heightClass)}>
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
          <p className="text-white/70 text-xs uppercase tracking-[0.2em] mb-1">
            {MEDIUM_LABELS[artwork.medium] || artwork.medium}
          </p>
          <h3 className="font-serif text-2xl text-white">{artwork.title}</h3>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <h3 className="font-serif text-xl">{artwork.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {MEDIUM_LABELS[artwork.medium] || artwork.medium}
            {artwork.size ? ` · ${artwork.size}` : ''}
          </p>
        </div>
        {artwork.price !== null && (
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            From ₹{artwork.price.toLocaleString('en-IN')}
          </p>
        )}
      </div>
    </Link>
  );
}
