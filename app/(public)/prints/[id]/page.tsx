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

const PRINT_SIZES = [
  { key: 'a5', label: 'A5', detail: '14.8 × 21 cm' },
  { key: 'a4', label: 'A4', detail: '21 × 29.7 cm' },
  { key: 'a3', label: 'A3', detail: '29.7 × 42 cm' },
];

export default function PrintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [print, setPrint] = useState<ShopProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('a4');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrint() {
      setLoading(true);
      const { data } = await supabase.from('print_designs').select('*').eq('id', id).eq('published', true).maybeSingle();
      if (data) {
        setPrint(data as ShopProduct);
      }
      setLoading(false);
    }
    if (id) void loadPrint();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-6xl px-6 pb-24 pt-32"><div className="grid gap-12 lg:grid-cols-2"><Skeleton className="aspect-[4/5] w-full" /><div className="space-y-5"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-12 w-3/4" /><Skeleton className="h-32 w-full" /></div></div></div>;
  if (!print) return <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 text-center"><h1 className="font-serif text-4xl">Print not found</h1><p className="mt-3 text-muted-foreground">This design may no longer be available.</p><Button asChild className="mt-8 rounded-none"><Link href="/prints">Back to designs</Link></Button></div>;

  const gallery = [print.image_url];
  const orderUrl = `/order?format=digital&product=${encodeURIComponent(print.title)}&productId=${print.id}&medium=${print.medium}&size=${size}`;

  return <div className="pb-24 pt-28"><section className="mx-auto max-w-6xl px-6 lg:px-8"><Link href="/prints" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" />All print-ready designs</Link><div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.8fr)] lg:gap-16"><div><div className="relative aspect-[4/5] overflow-hidden bg-muted"><Image src={gallery[activeImage]} alt={print.title} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" /></div>{gallery.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto">{gallery.map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 ${activeImage === index ? 'border-foreground' : 'border-transparent'}`}><Image src={image} alt="" fill sizes="64px" className="object-cover" /></button>)}</div>}</div><div className="lg:pt-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Print-ready design</p><h1 className="mt-3 font-serif text-5xl leading-[.95]">{print.title}</h1><p className="mt-5 font-serif text-2xl">From {formatINR(Number(print.price ?? 0))}</p><p className="mt-7 leading-relaxed text-muted-foreground">{print.description || 'A high-resolution artwork prepared for a beautiful print in your chosen size.'}</p><div className="mt-10 border-y border-border py-7"><p className="font-serif text-2xl">Select print size</p><div className="mt-4 grid grid-cols-3 gap-2">{PRINT_SIZES.map((option) => <button key={option.key} type="button" onClick={() => setSize(option.key)} className={`border px-3 py-3 text-left transition ${size === option.key ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground'}`}><span className="block text-sm font-medium">{option.label}</span><span className="mt-1 block text-[10px] text-muted-foreground">{option.detail}</span></button>)}</div></div><Button asChild size="lg" className="mt-8 w-full rounded-none"><Link href={orderUrl}>Add to order</Link></Button><p className="mt-3 text-center text-xs text-muted-foreground">You will enter your delivery details on the next step.</p><div className="mt-9 space-y-3 border-t border-border pt-7 text-sm text-muted-foreground">{['High-resolution file prepared for the selected print size', 'Delivered online after your order is confirmed', 'You can print with your preferred local print studio'].map((item) => <p key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />{item}</p>)}</div></div></div></section></div>;
}
