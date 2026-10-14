'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-client';
import type { PricingRule } from '@/types';

const FALLBACK_PRICES = [
  { key: 'single', label: 'Single Portrait', value: 2500 },
  { key: 'couple', label: 'Couple Portrait', value: 4500 },
  { key: 'family', label: 'Family Portrait', value: 6500 },
  { key: 'pet', label: 'Pet Portrait', value: 2200 },
  { key: 'large_custom', label: 'Large Custom', value: 9000 },
];

export default function PricingPage() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);

  useEffect(() => {
    supabase.from('pricing_rules').select('*').eq('type', 'base').eq('active', true)
      .then(({ data }) => {
        if (!data?.length) return;
        const rules = data as PricingRule[];
        setPrices(FALLBACK_PRICES.map((item) => ({
          ...item,
          value: Number(rules.find((rule) => rule.key === item.key)?.numeric_value ?? item.value),
        })));
      });
  }, []);

  return (
    <div className="pt-28 pb-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Transparent Pricing</p>
        <h1 className="font-serif text-5xl lg:text-6xl">Portrait pricing</h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground leading-relaxed">Each portrait is made to order. The final quote depends on size, medium, number of people and framing preferences.</p>
      </section>
      <section className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border">
          {prices.map((price) => <div key={price.key} className="bg-card p-8 text-center min-h-[190px] flex flex-col justify-center">
            <h2 className="font-serif text-2xl">{price.label}</h2>
            <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Starting from</p>
            <p className="font-serif text-3xl mt-2">{formatINR(price.value)}</p>
          </div>)}
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-10 border-y border-border py-12">
          <div><h2 className="font-serif text-3xl">What affects the price?</h2><p className="mt-4 text-muted-foreground leading-relaxed">Medium, paper size, number of subjects, background detail, framing and delivery timeline all shape the final estimate.</p></div>
          <div><h2 className="font-serif text-3xl">Need a custom quote?</h2><p className="mt-4 text-muted-foreground leading-relaxed">Share your reference photo and requirements. We will help you choose the right size and finish.</p><Button asChild className="mt-6 rounded-none"><Link href="/contact">Request a quote</Link></Button></div>
        </div>
      </section>
    </div>
  );
}
