'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/layout/reveal';
import { supabase } from '@/lib/supabase-client';
import type { Artwork } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortfolioPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const query = supabase
        .from('artworks')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      const { data } = await query;
      setArtworks((data as Artwork[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <section className="pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No artworks have been published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {artworks.map((art, i) => (
                <Reveal key={art.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <Link href={`/portfolio/${art.id}`} aria-label={`View ${art.title}`} className="group relative block aspect-square overflow-hidden bg-muted">
                    <Image src={art.image_url} alt={art.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
