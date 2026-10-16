'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatINR } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-client';
import type { ShopProduct } from '@/types';

const PAPER_SIZES = [
  { key: 'a4', label: 'A4', detail: '21 × 29.7 cm' },
  { key: 'a3', label: 'A3', detail: '29.7 × 42 cm' },
  { key: 'a2', label: 'A2', detail: '42 × 59.4 cm' },
];

export default function OriginalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [original, setOriginal] = useState<ShopProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('a3');
  const [framing, setFraming] = useState('unframed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOriginal() {
      setLoading(true);
      const { data } = await supabase.from('original_drawings').select('*').eq('id', id).eq('published', true).maybeSingle();
      if (data) {
        setOriginal(data as ShopProduct);
      }
      setLoading(false);
    }
    if (id) void loadOriginal();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-6xl px-6 pb-24 pt-32"><div className="grid gap-12 lg:grid-cols-2"><Skeleton className="aspect-[4/5] w-full" /><div className="space-y-5"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-12 w-3/4" /><Skeleton className="h-32 w-full" /></div></div></div>;
  if (!original) return <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 text-center"><h1 className="font-serif text-4xl">Original drawing not found</h1><p className="mt-3 text-muted-foreground">This artwork may no longer be available.</p><Button asChild className="mt-8 rounded-none"><Link href="/originals">Back to originals</Link></Button></div>;

  const gallery = [original.image_url];
  const orderUrl = `/order?format=physical&product=${encodeURIComponent(original.title)}&productId=${original.id}&medium=${original.medium}&size=${size}&framing=${framing}`;

  return <div className="pb-24 pt-28"><section className="mx-auto max-w-6xl px-6 lg:px-8"><Link href="/originals" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" />All original drawings</Link><div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.8fr)] lg:gap-16"><div><div className="relative aspect-[4/5] overflow-hidden bg-muted"><Image src={gallery[activeImage]} alt={original.title} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" /></div>{gallery.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto">{gallery.map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 ${activeImage === index ? 'border-foreground' : 'border-transparent'}`}><Image src={image} alt="" fill sizes="64px" className="object-cover" /></button>)}</div>}</div><div className="lg:pt-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Original drawing</p><h1 className="mt-3 font-serif text-5xl leading-[.95]">{original.title}</h1><p className="mt-5 font-serif text-2xl">{formatINR(Number(original.price ?? 0))}</p><p className="mt-7 leading-relaxed text-muted-foreground">{original.description || 'A hand-crafted portrait created with care and prepared for physical delivery.'}</p><div className="mt-10 border-y border-border py-7"><p className="font-serif text-2xl">Select artwork size</p><div className="mt-4 grid grid-cols-3 gap-2">{PAPER_SIZES.map((option) => <button key={option.key} type="button" onClick={() => setSize(option.key)} className={`border px-3 py-3 text-left transition ${size === option.key ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground'}`}><span className="block text-sm font-medium">{option.label}</span><span className="mt-1 block text-[10px] text-muted-foreground">{option.detail}</span></button>)}</div><p className="mt-7 font-serif text-2xl">Finish</p><div className="mt-4 grid grid-cols-2 gap-2">{[['unframed', 'Unframed'], ['framed', 'Framed']].map(([value, label]) => <button key={value} type="button" onClick={() => setFraming(value)} className={`border px-4 py-3 text-sm transition ${framing === value ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground'}`}>{label}</button>)}</div></div><Button asChild size="lg" className="mt-8 w-full rounded-none"><Link href={orderUrl}>Order original drawing</Link></Button><p className="mt-3 text-center text-xs text-muted-foreground">Your delivery address will be requested on the next step.</p><div className="mt-9 space-y-3 border-t border-border pt-7 text-sm text-muted-foreground">{['Physical artwork prepared in your selected size', 'Optional frame selection', 'Secure delivery to your address'].map((item) => <p key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />{item}</p>)}</div></div></div></section></div>;
}
