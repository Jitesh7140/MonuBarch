'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase-client';

function makeOrderNumber() {
  return `AMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function choice(value: string | null, allowed: string[], fallback: string) {
  return value && allowed.includes(value) ? value : fallback;
}

function OrderForm() {
  const searchParams = useSearchParams();
  const format = searchParams.get('format') === 'digital' ? 'digital' : 'physical';
  const medium = choice(searchParams.get('medium'), ['pencil', 'charcoal', 'colour'], 'pencil');
  const size = choice(searchParams.get('size'), ['a5', 'a4', 'a3', 'a2', 'custom'], 'a4');
  const people = choice(searchParams.get('people'), ['1', '2', '3', '4', '5'], '1');
  const framing = format === 'digital' ? 'unframed' : choice(searchParams.get('framing'), ['unframed', 'framed'], 'unframed');
  const product = String(searchParams.get('product') || '').slice(0, 160);
  const [status, setStatus] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const deadlineType = String(form.get('deadline_type'));
    setStatus('Submitting your request…');

    const notes = [
      `Delivery format: ${format === 'digital' ? 'Print-ready digital file' : 'Physical hard copy'}.`,
      product ? `Selected design: ${product}.` : '',
      String(form.get('special_instructions') || '').trim(),
    ].filter(Boolean).join('\n\n');

    const { error } = await supabase.from('orders').insert({
      order_number: makeOrderNumber(),
      customer_name: form.get('customer_name'),
      email: form.get('email'),
      phone: form.get('phone'),
      whatsapp: form.get('whatsapp') || null,
      address: format === 'digital' ? 'Digital delivery — no physical address required' : form.get('address'),
      city: format === 'digital' ? 'Digital delivery' : form.get('city'),
      state: format === 'digital' ? 'Digital delivery' : form.get('state'),
      pincode: format === 'digital' ? '000000' : form.get('pincode'),
      medium: form.get('medium'),
      size: form.get('size'),
      people_count: Number(form.get('people_count')),
      framing: format === 'digital' ? 'unframed' : form.get('framing'),
      deadline_type: deadlineType,
      deadline_date: deadlineType === 'preferred_date' ? form.get('deadline_date') || null : null,
      special_instructions: notes,
      estimated_price: 0,
    });

    if (error) { setStatus('Your request could not be submitted. Please try again.'); return; }
    formElement.reset();
    setStatus('Thank you — we received your commission request and will contact you shortly.');
  }

  return <div className="pt-28 pb-24"><section className="mx-auto max-w-4xl px-6 lg:px-8"><div className="text-center mb-14"><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Commission a portrait</p><h1 className="font-serif text-5xl lg:text-6xl">Start your order</h1><p className="mt-5 text-muted-foreground max-w-xl mx-auto">Share the basics below. We will confirm the final quote, timeline and photo-upload details with you personally.</p></div><div className="mb-8 border border-border bg-card p-5"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected format</p><p className="mt-1 font-serif text-2xl">{format === 'digital' ? 'Print-ready digital file' : 'Hard copy delivery'}</p>{product && <p className="mt-2 text-sm font-medium">Selected design: {product}</p>}<p className="mt-2 text-sm text-muted-foreground">{format === 'digital' ? 'Your completed artwork will be delivered online, so no physical address is needed.' : 'Your completed artwork will be sent to the delivery address below.'}</p></div><form onSubmit={submit} className="border border-border p-6 md:p-10 space-y-9"><fieldset><legend className="font-serif text-2xl mb-5">Your details</legend><div className="grid md:grid-cols-2 gap-5"><Input label="Full name" name="customer_name" required /><Input label="Email" name="email" type="email" required /><Input label="Phone" name="phone" required /><Input label="WhatsApp (optional)" name="whatsapp" /></div></fieldset><fieldset><legend className="font-serif text-2xl mb-5">Portrait details</legend><div className="grid md:grid-cols-2 gap-5"><Select label="Medium" name="medium" defaultValue={medium} options={[['pencil','Pencil'],['charcoal','Charcoal'],['colour','Colour']]} /><Select label="Size" name="size" defaultValue={size} options={[['a5','A5'],['a4','A4'],['a3','A3'],['a2','A2'],['custom','Custom']]} /><Select label="Number of people" name="people_count" defaultValue={people} options={[['1','1'],['2','2'],['3','3'],['4','4'],['5','5+']]} />{format === 'physical' && <Select label="Framing" name="framing" defaultValue={framing} options={[['unframed','Unframed'],['framed','Framed']]} />}<Select label="Timeline" name="deadline_type" options={[['flexible','Flexible'],['preferred_date','Preferred date'],['urgent','Urgent']]} /><Input label="Preferred date (if applicable)" name="deadline_date" type="date" /></div><label className="block text-sm mt-5">Special instructions<textarea name="special_instructions" rows={5} placeholder="Tell us about the occasion, background, or any important details." className="mt-2 w-full border border-input bg-background px-3 py-3" /></label></fieldset>{format === 'physical' && <fieldset><legend className="font-serif text-2xl mb-5">Delivery address</legend><div className="grid md:grid-cols-2 gap-5"><label className="text-sm md:col-span-2">Address<textarea required name="address" rows={3} className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><Input label="City" name="city" required /><Input label="State" name="state" required /><Input label="PIN code" name="pincode" required /></div></fieldset>}<Button type="submit" size="lg" className="rounded-none w-full">Submit commission request</Button>{status && <p role="status" className="text-center text-sm text-muted-foreground">{status}</p>}</form></section></div>;
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="text-sm">{label}<input {...props} className="mt-2 w-full border border-input bg-background px-3 py-3" /></label>; }
function Select({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[][] }) { return <label className="text-sm">{label}<select {...props} className="mt-2 w-full border border-input bg-background px-3 py-3">{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>; }

export default function OrderPage() { return <Suspense fallback={<div className="pt-36 pb-24 mx-auto max-w-4xl px-6 text-muted-foreground">Loading order form…</div>}><OrderForm /></Suspense>; }
