'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/layout/reveal';
import { getSiteSettings } from '@/lib/settings';

export default function AboutPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  return (
    <>
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">About</p>
            <h1 className="font-serif text-5xl lg:text-7xl leading-[1.05] max-w-3xl">
              The Artist Behind<br />the Portraits
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Artist Story */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] image-zoom-container">
                <Image
                  src="https://images.pexels.com/photos/3965682/pexels-photo-3965682.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Artist in studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={2}>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">The Story</p>
              <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                A Journey in Graphite and Charcoal
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {settings.about_intro || 'I am a self-taught portrait artist based in Mumbai, specialising in pencil and charcoal drawings.'}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                What began as a quiet hobby — sketching faces from magazines — slowly became a calling. Over the years, I have refined my craft through thousands of hours of patient observation, learning to see not just shapes and values, but the particular quality of presence that makes each face unique.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Artistic Style */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal className="order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">The Craft</p>
              <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                Artistic Style &amp; Technique
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {settings.about_style || 'My work focuses on capturing not just likeness, but presence.'}
              </p>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p><span className="text-foreground font-medium">Pencil.</span> I build tones gradually, layer by layer, from the lightest graphite dust to the deepest darks. This approach allows for an extraordinary range of subtle values.</p>
                <p><span className="text-foreground font-medium">Charcoal.</span> For dramatic depth and contrast, I work with vine and compressed charcoal, using stumps, erasers and fingers to blend and lift, letting the subject emerge from shadow.</p>
                <p><span className="text-foreground font-medium">Detail.</span> Every portrait is a study of patience — facial features, skin texture, the fall of light on hair, the particular expression in the eyes.</p>
              </div>
            </Reveal>
            <Reveal delay={2} className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] image-zoom-container">
                <Image
                  src="https://images.pexels.com/photos/21077237/pexels-photo-21077237.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Studio workspace"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Inspiration</p>
            <h2 className="font-serif text-3xl lg:text-5xl leading-tight mb-10">
              What Inspires the Work
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground font-serif italic">
              {settings.about_inspiration || 'I am inspired by the quiet dignity of ordinary faces, the way light falls on skin, and the stories that photographs carry.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Studio */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">The Studio</p>
            <h2 className="font-serif text-3xl lg:text-4xl">Where the Work Happens</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              'https://images.pexels.com/photos/34713672/pexels-photo-34713672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
              'https://images.pexels.com/photos/3873908/pexels-photo-3873908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
              'https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
            ].map((src, i) => (
              <Reveal key={i} delay={(i + 1) as 1 | 2 | 3}>
                <div className="relative aspect-[4/3] image-zoom-container">
                  <Image src={src} alt="Studio space" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-serif text-3xl lg:text-5xl leading-tight mb-8">
              Let&apos;s Create Something<br />Meaningful Together
            </h2>
            <Button asChild size="lg" className="rounded-none px-10">
              <Link href="/order">Commission a Portrait</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
