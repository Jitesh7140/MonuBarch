'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getDefaultSettings } from '@/lib/settings';
import { supabase } from '@/lib/supabase-client';

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const settings = getDefaultSettings();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('Sending…');
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from('contact_enquiries').insert({ name: form.get('name'), email: form.get('email'), phone: form.get('phone') || null, subject: form.get('subject'), message: form.get('message') });
    if (error) { setStatus('Could not send your message. Please try again.'); return; }
    event.currentTarget.reset(); setStatus('Thank you — your message has been sent.');
  }
  return <div className="pt-28 pb-24"><section className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16"><div><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Get in touch</p><h1 className="font-serif text-5xl lg:text-6xl">Let&apos;s create something meaningful.</h1><p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">Tell us about the portrait you have in mind. We will respond with guidance and a personalised quote.</p><div className="mt-12 space-y-5 text-muted-foreground"><p><span className="block text-xs uppercase tracking-wider mb-1">Email</span>{settings.email}</p><p><span className="block text-xs uppercase tracking-wider mb-1">Phone</span>{settings.phone}</p><p><span className="block text-xs uppercase tracking-wider mb-1">Studio</span>{settings.studio_location}</p></div></div><form onSubmit={submit} className="border border-border p-7 lg:p-10 space-y-5"><label className="block text-sm">Name<input required name="name" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="block text-sm">Email<input required type="email" name="email" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="block text-sm">Phone <span className="text-muted-foreground">(optional)</span><input name="phone" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="block text-sm">Subject<input required name="subject" className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><label className="block text-sm">Message<textarea required name="message" rows={5} className="mt-2 w-full border border-input bg-background px-3 py-3" /></label><Button type="submit" className="rounded-none w-full">Send message</Button>{status && <p className="text-sm text-muted-foreground" role="status">{status}</p>}</form></section></div>;
}
