'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { formatINR } from '@/lib/pricing';
import type { Artwork } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function OriginalsPage() {
  const [originals, setOriginals] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('artworks').select('*').eq('published', true).order('sort_order', { ascending: true })
      .then(({ data }) => { setOriginals((data as Artwork[]) ?? []); setLoading(false); });
  }, []);

  return <div className="pt-28 pb-24"><section className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-12 flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Original collection</p><h1 className="mt-3 font-serif text-5xl lg:text-6xl">Original drawings</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Choose an original artwork and place a request for physical delivery to your address.</p></div><p className="text-sm text-muted-foreground">{originals.length ? `${originals.length} original works` : ''}</p></div>{loading ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index}><Skeleton className="aspect-[4/5] w-full" /><Skeleton className="mt-4 h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-1/3" /></div>)}</div> : originals.length ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{originals.map((original) => <Link key={original.id} href={`/originals/${original.id}`} className="group block"><div className="relative aspect-[4/5] overflow-hidden bg-muted"><Image src={original.image_url} alt={original.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="mt-3 flex items-start justify-between gap-3"><div><h2 className="font-serif text-lg leading-tight">{original.title}</h2><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Original drawing</p></div><p className="shrink-0 text-sm">{formatINR(Number(original.price ?? 0))}</p></div></Link>)}</div> : <div className="py-24 text-center"><p className="font-serif text-3xl">No original drawings yet.</p><p className="mt-3 text-sm text-muted-foreground">Publish artworks in the admin dashboard to show them here.</p></div>}</section></div>;
}
