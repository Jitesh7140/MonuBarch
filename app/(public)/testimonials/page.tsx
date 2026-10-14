'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import type { Testimonial } from '@/types';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => { supabase.from('testimonials').select('*').eq('published', true).order('sort_order').then(({ data }) => setTestimonials((data ?? []) as Testimonial[])); }, []);
  return <div className="pt-28 pb-24"><section className="mx-auto max-w-5xl px-6 lg:px-8 text-center"><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Kind words</p><h1 className="font-serif text-5xl lg:text-6xl">Loved by clients</h1><p className="mt-6 max-w-xl mx-auto text-muted-foreground">Stories from people who trusted us with their most meaningful memories.</p></section><section className="mx-auto max-w-5xl px-6 lg:px-8 mt-16 grid md:grid-cols-2 gap-8">{testimonials.length ? testimonials.map((item) => <article key={item.id} className="border border-border p-8 lg:p-10"><div className="flex gap-1">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-foreground" />)}</div><blockquote className="font-serif text-2xl leading-relaxed mt-6">&ldquo;{item.review}&rdquo;</blockquote><p className="mt-8 text-sm text-muted-foreground">{item.customer_name}</p></article>) : <p className="md:col-span-2 text-center text-muted-foreground py-12">Testimonials will appear here soon.</p>}</section></div>;
}
