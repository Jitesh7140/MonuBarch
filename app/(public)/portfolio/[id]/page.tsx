'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/layout/reveal';
import { ArtworkCard } from '@/components/gallery/artwork-card';
import { supabase } from '@/lib/supabase-client';
import { CATEGORY_LABELS, MEDIUM_LABELS } from '@/lib/pricing';
import type { Artwork, ArtworkImage } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArtworkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [images, setImages] = useState<ArtworkImage[]>([]);
  const [related, setRelated] = useState<Artwork[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        const art = data as Artwork;
        setArtwork(art);

        const { data: imgData } = await supabase
          .from('artwork_images')
          .select('*')
          .eq('artwork_id', id)
          .order('sort_order', { ascending: true });

        setImages((imgData as ArtworkImage[]) || []);

        const { data: relData } = await supabase
          .from('artworks')
          .select('*')
          .eq('published', true)
          .eq('category', art.category)
          .neq('id', id)
          .order('sort_order', { ascending: true })
          .limit(3);

        setRelated((relData as Artwork[]) || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const allImages = artwork
    ? [artwork.image_url, ...images.map((i) => i.image_url)]
    : [];

  if (loading) {
    return (
      <div className="pt-32 pb-24 mx-auto max-w-7xl px-6 lg:px-8">
        <Skeleton className="h-12 w-96 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="pt-40 pb-24 mx-auto max-w-7xl px-6 text-center">
        <h1 className="font-serif text-4xl mb-4">Artwork Not Found</h1>
        <p className="text-muted-foreground mb-8">This artwork may have been removed or is no longer available.</p>
        <Button asChild className="rounded-none">
          <Link href="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-[4/5] image-zoom-container mb-4 onContextMenu={(e) => e.preventDefault()}>
                <Image
                  src={allImages[activeImage] || artwork.image_url}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-24 h-24 shrink-0 overflow-hidden border-2 transition-colors ${
                        activeImage === i ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-8">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                {CATEGORY_LABELS[artwork.category] || artwork.category}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl leading-tight mb-8">
                {artwork.title}
              </h1>

              <dl className="space-y-px bg-border">
                <div className="grid grid-cols-3 bg-card px-6 py-4">
                  <dt className="text-sm text-muted-foreground">Medium</dt>
                  <dd className="col-span-2 text-sm">{MEDIUM_LABELS[artwork.medium] || artwork.medium}</dd>
                </div>
                {artwork.size && (
                  <div className="grid grid-cols-3 bg-card px-6 py-4">
                    <dt className="text-sm text-muted-foreground">Size</dt>
                    <dd className="col-span-2 text-sm">{artwork.size}</dd>
                  </div>
                )}
                {artwork.year && (
                  <div className="grid grid-cols-3 bg-card px-6 py-4">
                    <dt className="text-sm text-muted-foreground">Year</dt>
                    <dd className="col-span-2 text-sm">{artwork.year}</dd>
                  </div>
                )}
                {artwork.price !== null && (
                  <div className="grid grid-cols-3 bg-card px-6 py-4">
                    <dt className="text-sm text-muted-foreground">Price</dt>
                    <dd className="col-span-2 text-sm">₹{artwork.price.toLocaleString('en-IN')}</dd>
                  </div>
                )}
              </dl>

              {artwork.description && (
                <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                  {artwork.description}
                </p>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-none px-8">
                  <Link href="/order">Commission Something Similar</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Artwork is protected. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="font-serif text-3xl mb-12">More From The Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {related.map((art, i) => (
                <Reveal key={art.id} delay={(i + 1) as 1 | 2 | 3}>
                  <ArtworkCard artwork={art} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
