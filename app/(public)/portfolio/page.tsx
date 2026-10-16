'use client';

import { useEffect, useState } from 'react';
import { ArtworkCard } from '@/components/gallery/artwork-card';
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
      let query = supabase
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
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Portfolio</p>
            <h1 className="font-serif text-5xl lg:text-6xl leading-tight mb-6">
              The Portfolio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Selected portrait works created in pencil, charcoal and colour. Each piece is a study of light, patience and presence.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-full h-[480px]" />
                  <Skeleton className="w-2/3 h-6 mt-4" />
                  <Skeleton className="w-1/3 h-4 mt-2" />
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No artworks have been published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {artworks.map((art, i) => (
                <Reveal key={art.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <ArtworkCard artwork={art} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
