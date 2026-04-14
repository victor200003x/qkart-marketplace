'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 16;
      const y = (clientY / innerHeight - 0.5) * 16;

      const blobs = heroRef.current.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.5;
        (blob as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative isolate mx-4 mt-24 mb-10 overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 px-6 py-12 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur-3xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(165,180,252,0.24),_transparent_17%),radial-gradient(circle_at_bottom_left,_rgba(252,211,77,0.16),_transparent_20%)]" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute right-16 top-16 h-28 w-28 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute left-1/2 top-28 h-44 w-44 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 text-center text-slate-900">
        <div className="relative rounded-[2rem] border border-white/30 bg-white/10 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
          <div className="relative mx-auto mb-8 flex h-72 w-72 items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-white/20 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"
              alt="Featured Espresso Machine"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          <h1 className="text-5xl font-semibold tracking-tight">Shop fresh groceries in crystal clarity</h1>
          <p className="mt-4 text-xl text-slate-700">Live market favorites, premium products, and fast checkout all in one sleek grocery experience.</p>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-3 gap-3 text-center text-sm font-medium text-slate-700">
          <div className="rounded-full border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-2xl">Fresh produce</div>
          <div className="rounded-full border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-2xl">Everyday essentials</div>
          <div className="rounded-full border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-2xl">Fast delivery</div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-full border border-white/20 bg-white/20 px-8 py-4 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <p className="text-2xl font-semibold text-slate-900">From $1.99</p>
          <button className="rounded-full bg-white/80 px-10 py-3 text-sm font-semibold text-slate-900 shadow-2xl shadow-slate-900/10 transition hover:bg-white/90">
            Explore fresh now
          </button>
        </div>
      </div>
    </section>
  );
}
