import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  ['01', 'Share your photo', 'Send a clear reference photo and tell us the size, medium and occasion.'],
  ['02', 'Receive your quote', 'We confirm the artwork details, price and estimated completion date before work begins.'],
  ['03', 'Portrait creation', 'Your portrait is hand-drawn with regular progress updates for complete peace of mind.'],
  ['04', 'Careful delivery', 'The finished portrait is packed securely and delivered to your doorstep.'],
];

export default function HowItWorksPage() {
  return <div className="pt-28 pb-24"><section className="bg-primary text-primary-foreground py-20 lg:py-28"><div className="mx-auto max-w-5xl px-6 lg:px-8 text-center"><p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">From photo to heirloom</p><h1 className="font-serif text-5xl lg:text-6xl">How it works</h1><p className="mt-6 max-w-xl mx-auto text-primary-foreground/75">A simple, personal process from your first message to the finished artwork.</p></div></section><section className="mx-auto max-w-5xl px-6 lg:px-8 py-20">{steps.map(([number, title, description]) => <article key={number} className="grid md:grid-cols-12 gap-5 py-10 border-t border-border"><span className="md:col-span-2 font-serif text-4xl text-muted-foreground">{number}</span><h2 className="md:col-span-4 font-serif text-3xl">{title}</h2><p className="md:col-span-6 text-muted-foreground leading-relaxed">{description}</p></article>)}<div className="text-center mt-10"><Button asChild size="lg" className="rounded-none px-10"><Link href="/contact">Begin your portrait</Link></Button></div></section></div>;
}
