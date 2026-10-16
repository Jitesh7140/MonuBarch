'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/layout/reveal';
import { ArtworkCard } from '@/components/gallery/artwork-card';
import { supabase } from '@/lib/supabase-client';
import { getSiteSettings } from '@/lib/settings';
import type { Artwork, Testimonial } from '@/types';

const STEPS = [
  { number: '01', title: 'Choose Your Portrait', desc: 'Select your medium, size and number of people.' },
  { number: '02', title: 'Upload Your Reference', desc: 'Upload a clear photograph that you want transformed into artwork.' },
  { number: '03', title: 'Confirm Your Order', desc: 'Review your selections, estimated price and delivery details.' },
  { number: '04', title: 'Your Artwork Is Created', desc: 'The artist handcrafts your portrait with attention to detail.' },
  { number: '05', title: 'Delivered With Care', desc: 'Your finished artwork is carefully packaged and delivered.' },
];

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const [artRes, testRes, settingsData] = await Promise.all([
        supabase
          .from('artworks')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(6),
        supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .limit(3),
        getSiteSettings(),
      ]);

      if (artRes.data) setArtworks(artRes.data as Artwork[]);
      if (testRes.data) setTestimonials(testRes.data as Testimonial[]);
      setSettings(settingsData);
    }
    loadData();
  }, []);

  const heroImage = artworks[0]?.image_url || '/portfolio/portrait-grace.png';

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Featured portrait artwork"
            fill
            priority
            sizes="100vw"
            className="object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl w-full px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {settings.subtitle || 'Handcrafted Pencil & Charcoal Portraits'}
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Turning Memories<br />Into Art
              </h1>
              <p className="mt-8 text-lg text-white/80 leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {settings.description || 'Detailed, handcrafted portraits created from your most meaningful photographs.'}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-white/90 px-8">
                  <Link href="/order">Order a Portrait</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-white/70 bg-transparent text-white hover:bg-white/20 hover:text-white hover:border-white px-8">
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Selected Works</p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
                A selection of portraits<br />created in pencil, charcoal<br />and colour.
              </h2>
            </div>
            <Link href="/portfolio" className="group inline-flex items-center gap-2 text-sm link-underline whitespace-nowrap">
              Explore Full Portfolio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {artworks.length > 0 ? (
              artworks.map((art, i) => (
                <Reveal key={art.id} delay={(i % 3 + 1) as 1 | 2 | 3}>
                  <ArtworkCard artwork={art} index={i} imageOnly />
                </Reveal>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-20">
                Artwork will appear here once published.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] image-zoom-container">
                <Image
                  src="https://images.pexels.com/photos/31621693/pexels-photo-31621693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Artist at work in the studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={2}>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">The Artist</p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-8">
                The Artist Behind<br />the Portraits
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {settings.about_intro || 'Every portrait I create is a quiet conversation between the subject and the medium — a patient layering of graphite and charcoal that slowly reveals the person within the photograph.'}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground mb-10">
                {settings.about_style || 'My work focuses on capturing not just likeness, but presence. I work primarily in pencil for its delicate tonal range and in charcoal for its dramatic depth.'}
              </p>
              <Link href="/about" className="group inline-flex items-center gap-2 text-sm link-underline">
                Discover My Story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COLLECTION CHOOSER */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">The collection</p>
            <h2 className="font-serif text-4xl lg:text-6xl">Choose your artwork.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Choose a print-ready design to print yourself, or an original hard-copy portrait delivered to you.</p>
          </Reveal>
          <div className="mt-14 grid gap-7 md:grid-cols-2 md:gap-6">
            <Reveal>
              <div><Link href="/prints" className="group relative block aspect-[4/5] w-full overflow-hidden text-center transition duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,.42)), url('/portfolio/portrait-grace.png')", backgroundPosition: 'center', backgroundSize: 'cover' }}><span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" /><span className="relative flex h-full flex-col items-center justify-center px-6 text-white"><span className="font-serif text-3xl uppercase tracking-wide md:text-4xl">Print-ready designs</span><span className="mt-5 bg-white px-5 py-2 text-xs font-medium text-foreground">View options</span></span></Link><p className="mx-auto mt-4 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">A high-resolution portrait file, prepared for you to print at home or with your preferred print studio.</p></div>
            </Reveal>
            <Reveal delay={2}>
              <div><Link href="/originals" className="group relative block aspect-[4/5] w-full overflow-hidden text-center transition duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,.42)), url('/portfolio/portrait-legacy.png')", backgroundPosition: 'center', backgroundSize: 'cover' }}><span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" /><span className="relative flex h-full flex-col items-center justify-center px-6 text-white"><span className="font-serif text-3xl uppercase tracking-wide md:text-4xl">Original drawings</span><span className="mt-5 bg-white px-5 py-2 text-xs font-medium text-foreground">View options</span></span></Link><p className="mx-auto mt-4 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">A physical, hand-crafted portrait delivered to your address, with optional framing.</p></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/50 mb-4">The Process</p>
            <h2 className="font-serif text-4xl lg:text-5xl">How It Works</h2>
          </Reveal>

          <div className="space-y-px">
            {STEPS.map((step, i) => (
              <Reveal key={step.number}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-primary-foreground/15 first:border-t-0">
                  <div className="md:col-span-2 font-serif text-4xl text-primary-foreground/40">
                    {step.number}
                  </div>
                  <div className="md:col-span-5">
                    <h3 className="font-serif text-2xl mb-2">{step.title}</h3>
                  </div>
                  <div className="md:col-span-5 text-primary-foreground/70 leading-relaxed">
                    {step.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-white/90 px-10">
              <Link href="/order">Start Your Portrait</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 lg:py-32 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal className="mb-16 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Kind Words</p>
              <h2 className="font-serif text-4xl lg:text-5xl">Testimonials</h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={(i + 1) as 1 | 2 | 3}>
                  <div className="flex flex-col h-full">
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-foreground text-foreground" />
                      ))}
                    </div>
                    <blockquote className="font-serif text-xl lg:text-2xl leading-relaxed flex-1 mb-8">
                      &ldquo;{t.review}&rdquo;
                    </blockquote>
                    <p className="text-sm text-muted-foreground">{t.customer_name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INSTAGRAM / SOCIAL */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Follow the Studio</p>
            <h2 className="font-serif text-4xl lg:text-5xl mb-4">On Instagram</h2>
            <a
              href={settings.instagram_url || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {settings.instagram_handle || '@aaravportraits'}
            </a>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
            {artworks.slice(0, 6).map((art, i) => (
              <Reveal key={art.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <a
                  href={settings.instagram_url || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-square image-zoom-container"
                >
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3778177/pexels-photo-3778177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-serif text-4xl lg:text-6xl text-white leading-tight mb-8">
              Your Story Deserves<br />To Be Drawn.
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Turn a meaningful photograph into a handcrafted portrait you&apos;ll keep for years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-white/90 px-10">
                <Link href="/order">Commission Your Portrait</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-white/40 text-white hover:bg-white/10 hover:text-white hover:border-white/60 px-10">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
