'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="pt-28 pb-24">
      <section className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">The collection</p>
        <h1 className="font-serif text-5xl lg:text-6xl">Choose your artwork.</h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">Choose a print-ready design to print yourself, or an original hard-copy portrait delivered to you.</p>
      </section>

      <section className="mx-auto mt-14 max-w-4xl px-6 lg:px-8">
        <div className="grid gap-7 md:grid-cols-2 md:gap-5">
          <div>
            <Link href="/prints" className="group relative block aspect-[4/5] w-full overflow-hidden text-center transition duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('https://images.pexels.com/photos/7608653/pexels-photo-7608653.jpeg?auto=compress&cs=tinysrgb&w=1200')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
              <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" />
              <span className="relative flex h-full flex-col items-center justify-center px-6 text-white"><span className="font-serif text-3xl uppercase tracking-wide md:text-4xl">Print-ready designs</span><span className="mt-5 bg-white px-5 py-2 text-xs font-medium text-foreground">View options</span></span>
            </Link>
            <p className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">A high-resolution portrait file, prepared for you to print at home or with your preferred print studio.</p>
          </div>
          <div>
            <Link href="/originals" className="group relative block aspect-[4/5] w-full overflow-hidden text-center transition duration-500 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('https://images.pexels.com/photos/36738957/pexels-photo-36738957.jpeg?auto=compress&cs=tinysrgb&w=1200')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
              <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" />
              <span className="relative flex h-full flex-col items-center justify-center px-6 text-white"><span className="font-serif text-3xl uppercase tracking-wide md:text-4xl">Original drawings</span><span className="mt-5 bg-white px-5 py-2 text-xs font-medium text-foreground">View options</span></span>
            </Link>
            <p className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">A physical, hand-crafted portrait delivered to your address, with optional framing.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
