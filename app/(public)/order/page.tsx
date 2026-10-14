'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase-client';

function makeOrderNumber() {
  return `AMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default function OrderPage() {
  const [status, setStatus] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Submitting your request…');
    const form = new FormData(event.currentTarget);
    const deadlineType = String(form.get('deadline_type'));
    const { error } = await supabase.from('orders').insert({
      order_number: makeOrderNumber(),
      customer_name: form.get('customer_name'),
      email: form.get('email'),
      phone: form.get('phone'),
      whatsapp: form.get('whatsapp') || null,
      address: form.get('address'),
      city: form.get('city'),
      state: form.get('state'),
      pincode: form.get('pincode'),
      medium: form.get('medium'),
      size: form.get('size'),
      people_count: Number(form.get('people_count')),
      framing: form.get('framing'),
      deadline_type: deadlineType,
      deadline_date: deadlineType === 'preferred_date' ? form.get('deadline_date') || null : null,
      special_instructions: form.get('special_instructions') || null,
      estimated_price: 0,
    });
    if (error) { setStatus('Your request could not be submitted. Please try again.'); return; }
    event.currentTarget.reset();
    setStatus('Thank you — we received your commission request and will contact you shortly.');
  }

  return <div className="pt-28 pb-24"><section className="mx-auto max-w-4xl px-6 lg:px-8"><div className="text-center mb-14"><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Commission a portrait</p><h1 className="font-serif text-5xl lg:text-6xl">Start your order</h1><p className="mt-5 text-muted-foreground max-w-xl mx-auto">Share the basics below. We will confirm the final quote, timeline and photo-upload details with you personally.</p></div><form onSubmit={submit} className="border border-border p-6 md:p-10 space-y-9"><fieldset><legend className="font-serif text-2xl mb-5">Your details</legend><div className="grid md:grid-cols-2 gap-5"><label className="text-sm">Full name<input required name="customer_name" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">Email<input required type="email" name="email" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">Phone<input required name="phone" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">WhatsApp <span className="text-muted-foreground">(optional)</span><input name="whatsapp" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label></div></fieldset><fieldset><legend className="font-serif text-2xl mb-5">Portrait details</legend><div className="grid md:grid-cols-2 gap-5"><label className="text-sm">Medium<select name="medium" className="mt-2 w-full border border-input bg-background px-3 py-3"><option value="pencil">Pencil</option><option value="charcoal">Charcoal</option><option value="colour">Colour</option></select></label><label className="text-sm">Size<select name="size" className="mt-2 w-full border border-input bg-background px-3 py-3"><option value="a5">A5</option><option value="a4">A4</option><option value="a3">A3</option><option value="a2">A2</option><option value="custom">Custom</option></select></label><label className="text-sm">Number of people<select name="people_count" className="mt-2 w-full border border-input bg-background px-3 py-3"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5+</option></select></label><label className="text-sm">Framing<select name="framing" className="mt-2 w-full border border-input bg-background px-3 py-3"><option value="unframed">Unframed</option><option value="basic">Basic frame</option><option value="premium">Premium frame</option></select></label><label className="text-sm">Timeline<select name="deadline_type" className="mt-2 w-full border border-input bg-background px-3 py-3"><option value="flexible">Flexible</option><option value="preferred_date">Preferred date</option><option value="urgent">Urgent</option></select></label><label className="text-sm">Preferred date <span className="text-muted-foreground">(if applicable)</span><input type="date" name="deadline_date" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label></div><label className="block text-sm mt-5">Special instructions<textarea name="special_instructions" rows={5} placeholder="Tell us about the occasion, background, or any important details." className="mt-2 w-full border border-input bg-background px-3 py-3" /></label></fieldset><fieldset><legend className="font-serif text-2xl mb-5">Delivery address</legend><div className="grid md:grid-cols-2 gap-5"><label className="text-sm md:col-span-2">Address<textarea required name="address" rows={3} className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">City<input required name="city" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">State<input required name="state" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="text-sm">PIN code<input required name="pincode" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label></div></fieldset><Button type="submit" size="lg" className="rounded-none w-full">Submit commission request</Button>{status && <p role="status" className="text-center text-sm text-muted-foreground">{status}</p>}</form></section></div>;
}
